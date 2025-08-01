import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

// Storage configuration
const STORAGE_BUCKET = 'carousel-images'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const IMAGE_QUALITY = 0.8
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080

// Supabase client for storage operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Storage error types
 */
export interface StorageError {
  message: string
  code: string
  details?: string
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  url: string
  path: string
  size: number
  width: number
  height: number
  format: string
  metadata: {
    uploaded_at: string
    user_id: string
    original_name: string
    optimized: boolean
  }
}

/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'jpeg' | 'png' | 'webp'
  progressive?: boolean
}

/**
 * Supabase Storage Manager
 */
export class SupabaseStorageManager {
  private bucket: string

  constructor(bucket: string = STORAGE_BUCKET) {
    this.bucket = bucket
  }

  /**
   * Initialize storage bucket
   */
  async initializeBucket(): Promise<{ success: boolean; error?: StorageError }> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        return {
          success: false,
          error: {
            message: 'Failed to list storage buckets',
            code: 'BUCKET_LIST_ERROR',
            details: listError.message
          }
        }
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.bucket)

      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(this.bucket, {
          public: true,
          allowedMimeTypes: ALLOWED_IMAGE_TYPES,
          fileSizeLimit: MAX_FILE_SIZE
        })

        if (createError) {
          return {
            success: false,
            error: {
              message: 'Failed to create storage bucket',
              code: 'BUCKET_CREATE_ERROR',
              details: createError.message
            }
          }
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Storage initialization failed',
          code: 'INIT_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Upload image file
   */
  async uploadImage(
    file: File | Buffer,
    userId: string,
    options: {
      fileName?: string
      folder?: string
      optimize?: boolean
      optimizationOptions?: ImageOptimizationOptions
    } = {}
  ): Promise<{ data?: ImageUploadResult; error?: StorageError }> {
    try {
      // Validate file
      const validationResult = await this.validateImageFile(file)
      if (validationResult.error) {
        return { error: validationResult.error }
      }

      // Generate file path
      const fileName = options.fileName || this.generateFileName(file)
      const folder = options.folder || 'uploads'
      const filePath = `${folder}/${userId}/${Date.now()}_${fileName}`

      // Optimize image if requested
      let uploadFile: File | Buffer = file
      if (options.optimize) {
        const optimizationResult = await this.optimizeImage(file, options.optimizationOptions)
        if (optimizationResult.error) {
          return { error: optimizationResult.error }
        }
        uploadFile = optimizationResult.data!
      }

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, uploadFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return {
          error: {
            message: 'Failed to upload image',
            code: 'UPLOAD_ERROR',
            details: error.message
          }
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath)

      // Get file metadata
      const metadata = await this.getFileMetadata(filePath)

      const result: ImageUploadResult = {
        url: urlData.publicUrl,
        path: filePath,
        size: metadata.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        metadata: {
          uploaded_at: new Date().toISOString(),
          user_id: userId,
          original_name: fileName,
          optimized: options.optimize || false
        }
      }

      return { data: result }
    } catch (error) {
      return {
        error: {
          message: 'Image upload failed',
          code: 'UPLOAD_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: (File | Buffer)[],
    userId: string,
    options: {
      folder?: string
      optimize?: boolean
      optimizationOptions?: ImageOptimizationOptions
    } = {}
  ): Promise<{ data?: ImageUploadResult[]; error?: StorageError }> {
    try {
      const results: ImageUploadResult[] = []
      const errors: StorageError[] = []

      // Upload files in parallel
      const uploadPromises = files.map(async (file, index) => {
        const result = await this.uploadImage(file, userId, {
          fileName: `image_${index + 1}`,
          folder: options.folder,
          optimize: options.optimize,
          optimizationOptions: options.optimizationOptions
        })

        if (result.error) {
          errors.push(result.error)
        } else {
          results.push(result.data!)
        }
      })

      await Promise.all(uploadPromises)

      if (errors.length > 0) {
        return {
          error: {
            message: `Failed to upload ${errors.length} images`,
            code: 'BATCH_UPLOAD_ERROR',
            details: errors.map(e => e.message).join(', ')
          }
        }
      }

      return { data: results }
    } catch (error) {
      return {
        error: {
          message: 'Batch image upload failed',
          code: 'BATCH_UPLOAD_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Delete image file
   */
  async deleteImage(filePath: string): Promise<{ success: boolean; error?: StorageError }> {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([filePath])

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to delete image',
            code: 'DELETE_ERROR',
            details: error.message
          }
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Image deletion failed',
          code: 'DELETE_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Get public URL for image
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  /**
   * List user's images
   */
  async listUserImages(
    userId: string,
    folder?: string
  ): Promise<{ data?: ImageUploadResult[]; error?: StorageError }> {
    try {
      const path = folder ? `${folder}/${userId}` : userId

      const { data, error } = await supabase.storage
        .from(this.bucket)
        .list(path)

      if (error) {
        return {
          error: {
            message: 'Failed to list user images',
            code: 'LIST_ERROR',
            details: error.message
          }
        }
      }

      const images: ImageUploadResult[] = []

      for (const file of data) {
        const filePath = `${path}/${file.name}`
        const metadata = await this.getFileMetadata(filePath)
        
        images.push({
          url: this.getPublicUrl(filePath),
          path: filePath,
          size: metadata.size,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          metadata: {
            uploaded_at: file.created_at,
            user_id: userId,
            original_name: file.name,
            optimized: false
          }
        })
      }

      return { data: images }
    } catch (error) {
      return {
        error: {
          message: 'Failed to list user images',
          code: 'LIST_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Validate image file
   */
  private async validateImageFile(file: File | Buffer): Promise<{ valid: boolean; error?: StorageError }> {
    try {
      // Check file size
      const size = file instanceof File ? file.size : file.length
      if (size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: {
            message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            code: 'FILE_SIZE_ERROR'
          }
        }
      }

      // Check file type
      if (file instanceof File) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          return {
            valid: false,
            error: {
              message: `File type ${file.type} is not allowed`,
              code: 'FILE_TYPE_ERROR'
            }
          }
        }
      }

      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: {
          message: 'File validation failed',
          code: 'VALIDATION_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Generate unique file name
   */
  private generateFileName(file: File | Buffer): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    
    if (file instanceof File) {
      const extension = file.name.split('.').pop() || 'jpg'
      return `${timestamp}_${random}.${extension}`
    } else {
      return `${timestamp}_${random}.jpg`
    }
  }

  /**
   * Optimize image using browser APIs
   */
  private async optimizeImage(
    file: File | Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<{ data?: File; error?: StorageError }> {
    try {
      const {
        quality = IMAGE_QUALITY,
        maxWidth = MAX_WIDTH,
        maxHeight = MAX_HEIGHT,
        format = 'jpeg',
        progressive = true
      } = options

      // Convert buffer to file if needed
      let imageFile: File
      if (file instanceof Buffer) {
        imageFile = new File([file], 'image.jpg', { type: 'image/jpeg' })
      } else {
        imageFile = file as File
      }

      // Create canvas for optimization
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Create image element
      const img = new Image()
      const imageUrl = URL.createObjectURL(imageFile)

      return new Promise((resolve) => {
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          // Draw and optimize image
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], imageFile.name, {
                  type: `image/${format}`
                })
                resolve({ data: optimizedFile })
              } else {
                resolve({
                  error: {
                    message: 'Failed to optimize image',
                    code: 'OPTIMIZATION_ERROR'
                  }
                })
              }
            },
            `image/${format}`,
            quality
          )

          // Clean up
          URL.revokeObjectURL(imageUrl)
        }

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl)
          resolve({
            error: {
              message: 'Failed to load image for optimization',
              code: 'IMAGE_LOAD_ERROR'
            }
          })
        }

        img.src = imageUrl
      })
    } catch (error) {
      return {
        error: {
          message: 'Image optimization failed',
          code: 'OPTIMIZATION_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Get file metadata
   */
  private async getFileMetadata(filePath: string): Promise<{
    size: number
    width: number
    height: number
    format: string
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .download(filePath)

      if (error || !data) {
        return {
          size: 0,
          width: 0,
          height: 0,
          format: 'unknown'
        }
      }

      // Create image element to get dimensions
      const img = new Image()
      const imageUrl = URL.createObjectURL(data)

      return new Promise((resolve) => {
        img.onload = () => {
          const format = filePath.split('.').pop() || 'jpg'
          resolve({
            size: data.size,
            width: img.width,
            height: img.height,
            format
          })
          URL.revokeObjectURL(imageUrl)
        }

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl)
          resolve({
            size: data.size,
            width: 0,
            height: 0,
            format: 'unknown'
          })
        }

        img.src = imageUrl
      })
    } catch (error) {
      return {
        size: 0,
        width: 0,
        height: 0,
        format: 'unknown'
      }
    }
  }
}

// Export singleton instance
export const storageManager = new SupabaseStorageManager()

// Export utility functions
export const uploadImage = storageManager.uploadImage.bind(storageManager)
export const uploadMultipleImages = storageManager.uploadMultipleImages.bind(storageManager)
export const deleteImage = storageManager.deleteImage.bind(storageManager)
export const getPublicUrl = storageManager.getPublicUrl.bind(storageManager)
export const listUserImages = storageManager.listUserImages.bind(storageManager) 