# 🤖 AI Generation System Development Rules

## 📋 Project Overview
This rule set governs the development of the AI Generation System that transforms the existing Social SaaS carousel generation into a production-ready, event-driven platform.

## 🎯 Core Development Principles

### 1. Event-Driven Architecture First
- **NEVER** implement blocking operations in API routes
- **ALWAYS** use job queues for long-running processes
- **PREFER** real-time subscriptions over polling
- **IMPLEMENT** proper job status tracking

### 2. AWS Amplify Optimization
- **OPTIMIZE** for serverless deployment
- **MINIMIZE** build times and bundle size
- **USE** environment variables for configuration
- **IMPLEMENT** proper caching strategies

### 3. Type Safety & Code Quality
- **REQUIRE** TypeScript strict mode
- **DEFINE** comprehensive interfaces for all data structures
- **IMPLEMENT** proper error handling with typed errors
- **MAINTAIN** 80%+ test coverage

## 🗃️ Database Development Rules

### Schema Evolution
- **ALWAYS** use migrations for schema changes
- **IMPLEMENT** proper indexing for performance
- **ENABLE** Row Level Security (RLS) for all tables
- **VERSION** database changes with rollback procedures

### Queue Management
```typescript
// ✅ CORRECT: Proper job creation
const job = await queueManager.createJob({
  carouselId: carousel.id,
  userId: user.id,
  payload: validatedData,
  priority: 1
});

// ❌ WRONG: Direct processing in API route
const result = await generateCarouselDirectly(data);
```

### Performance Guidelines
- **INDEX** frequently queried columns
- **LIMIT** result sets with pagination
- **USE** prepared statements for repeated queries
- **MONITOR** query performance in production

## 🤖 AI Service Integration Rules

### Service Architecture
- **ABSTRACT** AI services behind common interfaces
- **IMPLEMENT** fallback mechanisms for service failures
- **TRACK** costs and usage per service
- **HANDLE** rate limiting gracefully

### Error Handling
```typescript
// ✅ CORRECT: Comprehensive error handling
try {
  const result = await aiService.generate(prompt);
  return result;
} catch (error) {
  if (error instanceof RateLimitError) {
    await queueManager.requeueJob(jobId, { delay: 60000 });
  } else if (error instanceof QuotaExceededError) {
    await notifyUser(userId, 'quota_exceeded');
  } else {
    await logError(error, { jobId, userId });
    throw new ProcessingError('AI generation failed');
  }
}

// ❌ WRONG: Generic error handling
try {
  return await aiService.generate(prompt);
} catch (error) {
  console.log(error);
  throw error;
}
```

### Prompt Engineering
- **MAINTAIN** master prompt templates
- **VERSION** prompt changes for A/B testing
- **VALIDATE** prompts before sending to AI services
- **OPTIMIZE** prompts for cost and quality

## ⚙️ Queue System Rules

### Job Processing
- **PROCESS** jobs in priority order
- **IMPLEMENT** retry logic with exponential backoff
- **UPDATE** progress in real-time
- **HANDLE** job cancellation gracefully

### Job Lifecycle
```typescript
// ✅ CORRECT: Complete job lifecycle
const processor = new JobProcessor();

await processor.processJob(job)
  .onProgress((percent, message) => {
    updateProgress(job.id, percent, message);
  })
  .onError((error) => {
    handleJobError(job.id, error);
  })
  .onComplete((result) => {
    completeJob(job.id, result);
  });

// ❌ WRONG: Fire and forget processing
processJob(job); // No progress tracking or error handling
```

### Retry Strategy
- **IMPLEMENT** exponential backoff for retries
- **LIMIT** maximum retry attempts
- **CATEGORIZE** errors for appropriate retry behavior
- **LOG** retry attempts for monitoring

## 🔄 Real-time Communication Rules

### Supabase Real-time
- **SUBSCRIBE** to specific record changes only
- **CLEANUP** subscriptions on component unmount
- **HANDLE** connection failures gracefully
- **OPTIMIZE** for minimal bandwidth usage

### Frontend Integration
```typescript
// ✅ CORRECT: Proper subscription management
useEffect(() => {
  const channel = supabase
    .channel(`job-${jobId}`)
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'generation_jobs', filter: `id=eq.${jobId}` },
      handleJobUpdate
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [jobId]);

// ❌ WRONG: Memory leaks and broad subscriptions
useEffect(() => {
  supabase.channel('all-jobs')
    .on('postgres_changes', { event: '*', table: 'generation_jobs' }, handleUpdate)
    .subscribe();
  // No cleanup!
}, []);
```

## 📱 Frontend Development Rules

### Component Architecture
- **SEPARATE** stateful logic from UI components
- **USE** custom hooks for complex state management
- **IMPLEMENT** loading and error states consistently
- **OPTIMIZE** for mobile-first responsive design

### Progress Tracking
- **SHOW** progress indicators for all long-running operations
- **ESTIMATE** completion times when possible
- **PROVIDE** meaningful progress messages
- **HANDLE** interruptions gracefully

### Error States
```typescript
// ✅ CORRECT: Comprehensive error handling
const [error, setError] = useState<string | null>(null);
const [retry, setRetry] = useState<() => void | null>(null);

const handleError = (error: Error, retryFn?: () => void) => {
  setError(getUserFriendlyMessage(error));
  setRetry(() => retryFn);
  logError(error, { component: 'CarouselGenerator', userId });
};

// ❌ WRONG: Generic error display
const [error, setError] = useState(null);
setError(error.message); // Raw error message to user
```

## 🔧 API Development Rules

### Route Design
- **RETURN** job IDs for async operations
- **VALIDATE** inputs with Zod schemas
- **IMPLEMENT** rate limiting per user
- **PROVIDE** consistent error responses

### Response Format
```typescript
// ✅ CORRECT: Consistent API responses
// Success response
return NextResponse.json({
  success: true,
  data: { jobId: 'uuid', estimatedTime: 60 },
  message: 'Generation started successfully'
});

// Error response
return NextResponse.json({
  success: false,
  error: 'INSUFFICIENT_CREDITS',
  message: 'You need more credits to generate content',
  code: 402
}, { status: 402 });

// ❌ WRONG: Inconsistent responses
return NextResponse.json({ id: jobId }); // Missing context
return new NextResponse('Error', { status: 500 }); // No details
```

### Authentication & Authorization
- **VERIFY** user authentication on every request
- **CHECK** user permissions for resources
- **VALIDATE** request origins and CSRF tokens
- **LOG** security-related events

## 🧪 Testing Rules

### Test Coverage Requirements
- **ACHIEVE** 80%+ code coverage
- **TEST** all API endpoints
- **MOCK** external AI services in tests
- **VALIDATE** error handling paths

### Test Organization
```typescript
// ✅ CORRECT: Well-organized tests
describe('QueueManager', () => {
  describe('createJob', () => {
    it('should create job with valid payload', async () => {
      // Arrange
      const mockData = createMockJobData();
      
      // Act
      const jobId = await queueManager.createJob(mockData);
      
      // Assert
      expect(jobId).toBeDefined();
      expect(await queueManager.getJob(jobId)).toMatchObject(mockData);
    });
    
    it('should reject invalid payload', async () => {
      // Test error cases
    });
  });
});

// ❌ WRONG: Unorganized tests
test('queue stuff', () => {
  // Multiple unrelated assertions
});
```

## 🚀 Deployment Rules

### AWS Amplify Configuration
- **USE** environment variables for all configurations
- **IMPLEMENT** proper build caching
- **OPTIMIZE** for cold start performance
- **MONITOR** deployment metrics

### Environment Management
```yaml
# ✅ CORRECT: Proper amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npm run generate:types
    build:
      commands:
        - npm run build
        - npm run postbuild:optimize
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Security
- **ROTATE** API keys regularly
- **USE** principle of least privilege
- **IMPLEMENT** proper CORS policies
- **AUDIT** dependencies for vulnerabilities

## 📊 Monitoring & Logging Rules

### Structured Logging
```typescript
// ✅ CORRECT: Structured logging
logger.info('Job processing started', {
  jobId: job.id,
  userId: job.user_id,
  jobType: job.job_type,
  estimatedDuration: 60
});

// ❌ WRONG: Unstructured logging
console.log(`Job ${job.id} started for user ${job.user_id}`);
```

### Performance Monitoring
- **TRACK** API response times
- **MONITOR** queue processing rates
- **ALERT** on error rate spikes
- **MEASURE** user satisfaction metrics

## 🔄 Development Workflow Rules

### Phase Completion Criteria
Each phase must meet all success criteria before proceeding:
- ✅ All functionality working as specified
- ✅ Tests passing with required coverage
- ✅ Documentation updated
- ✅ Code reviewed and committed
- ✅ Performance requirements met

### Code Quality Gates
- **REQUIRE** TypeScript strict mode
- **ENFORCE** ESLint rules
- **FORMAT** code with Prettier
- **REVIEW** all changes before merging

### Documentation
- **UPDATE** workflow documentation after each phase
- **DOCUMENT** API changes and new features
- **MAINTAIN** troubleshooting guides
- **RECORD** architectural decisions

## ⚠️ Common Pitfalls to Avoid

### Database
- ❌ Creating tables without proper indexes
- ❌ Forgetting to enable RLS on sensitive tables
- ❌ Not planning for data growth and performance
- ❌ Hardcoding database connections

### AI Services
- ❌ Not handling rate limits properly
- ❌ Exposing API keys in client-side code
- ❌ Not implementing cost controls
- ❌ Ignoring AI service deprecations

### Queue System
- ❌ Processing jobs synchronously in API routes
- ❌ Not implementing proper retry logic
- ❌ Missing progress tracking
- ❌ Not handling job cancellation

### Frontend
- ❌ Not cleaning up subscriptions
- ❌ Polling instead of using real-time updates
- ❌ Not handling offline states
- ❌ Missing loading indicators

## 🎯 Success Metrics

### Technical Metrics
- Generation time < 60 seconds
- API response time < 500ms
- 99.5% uptime
- < 1% error rate

### Quality Metrics
- 80%+ test coverage
- Zero critical security vulnerabilities
- TypeScript strict mode compliance
- ESLint rules compliance

### User Experience Metrics
- Real-time progress updates
- Clear error messages
- Mobile-responsive design
- Accessibility compliance

---

**Remember**: These rules ensure we build a scalable, maintainable, and production-ready AI generation system. Follow them consistently throughout development. 