# Test Suite Documentation

## Overview

This test suite provides comprehensive testing for the GreenThumb garden management system, covering both unit tests for the service layer and integration tests for API routes.

## Test Structure

### Service Layer Tests (`lib/services/__tests__/`)

#### `garden.service.test.ts`

- **Purpose**: Tests the `GardenService` business logic
- **Coverage**:
  - `getGardenById()` - Garden retrieval with ownership verification
  - `calculateGardenStatistics()` - Plant health statistics calculation
  - `updateGarden()` - Garden configuration updates
  - `deleteGarden()` - Garden deletion with plant cleanup
  - `getUserGardensWithStats()` - User garden overview with statistics
  - `getGardenOverviewStats()` - Overall garden statistics

#### `plant.service.test.ts`

- **Purpose**: Tests the `PlantService` business logic
- **Coverage**:
  - `getUserPlants()` - Plant retrieval across gardens
  - `addPlantToGarden()` - Adding plants to gardens
  - `removePlantFromGarden()` - Removing plants from gardens
  - `updateGardenPlants()` - Bulk plant updates
  - `getGardenRecommendations()` - Plant recommendation logic

#### `user-garden.service.test.ts`

- **Purpose**: Tests the `UserGardenService` business logic
- **Coverage**:
  - `getUserGardenSettings()` - User garden settings retrieval
  - `saveUserGardenSettings()` - Creating/updating garden settings

### API Route Tests (`app/api/__tests__/`)

#### `gardens.test.ts`

- **Purpose**: Integration tests for garden API endpoints
- **Coverage**:
  - `GET /api/gardens/[id]` - Garden detail retrieval
  - `PUT /api/gardens/[id]` - Garden updates
  - `DELETE /api/gardens/[id]` - Garden deletion

#### `user-plants.test.ts`

- **Purpose**: Integration tests for user plants API endpoints
- **Coverage**:
  - `GET /api/user-plants` - Plant retrieval
  - `POST /api/user-plants` - Plant management (add/remove/update)

#### `garden-recommendations.test.ts`

- **Purpose**: Integration tests for plant recommendations
- **Coverage**:
  - `GET /api/gardens/[id]/recommendations` - Plant recommendations

#### `user-gardens.test.ts`

- **Purpose**: Integration tests for user garden settings
- **Coverage**:
  - `GET /api/user-gardens` - Settings retrieval
  - `POST /api/user-gardens` - Settings creation/updates

#### `garden-overview.test.ts`

- **Purpose**: Integration tests for garden overview
- **Coverage**:
  - `GET /api/gardens/overview` - Garden overview with statistics

## Test Configuration

### Setup (`lib/__tests__/setup.ts`)

- **Browser Environment**: Mocks window, navigator, screen objects
- **Performance API**: Mocks performance monitoring
- **Console Methods**: Reduces test output noise
- **Next.js Globals**: Mocks NextRequest and NextResponse
- **Environment Variables**: Sets test environment variables

### Vitest Configuration (`vitest.config.ts`)

- **Environment**: jsdom for browser-like testing
- **Setup Files**: Automatically loads test setup
- **Path Aliases**: Maps `@/` imports to project root
- **Globals**: Enables global test functions

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Patterns

#### Service Layer Testing

- **Mocking**: Prisma client and Next.js cache functions
- **Isolation**: Each test is independent with proper setup/teardown
- **Error Handling**: Tests both success and error scenarios
- **Type Safety**: Ensures proper TypeScript types throughout

#### API Route Testing

- **Authentication**: Tests both authenticated and unauthenticated scenarios
- **Validation**: Tests input validation and error responses
- **HTTP Status Codes**: Verifies correct status codes for different scenarios
- **Response Format**: Ensures consistent response structure

## Test Coverage

### Current Coverage Areas

- ✅ Service layer business logic
- ✅ API route integration
- ✅ Error handling and edge cases
- ✅ Authentication and authorization
- ✅ Data validation and transformation
- ✅ Cache management
- ✅ Type safety

### Future Coverage Areas

- 🔄 Database integration tests
- 🔄 Component testing (React components)
- 🔄 End-to-end testing
- 🔄 Performance testing
- 🔄 Security testing

## Best Practices

### Test Organization

- **Single Responsibility**: Each test focuses on one specific behavior
- **Descriptive Names**: Test names clearly describe what is being tested
- **Arrange-Act-Assert**: Consistent test structure
- **Mock Isolation**: Proper mocking to avoid external dependencies

### Error Testing

- **Happy Path**: Tests successful operations
- **Error Scenarios**: Tests failure cases and error handling
- **Edge Cases**: Tests boundary conditions and unusual inputs
- **Authentication**: Tests both authorized and unauthorized access

### Maintenance

- **Regular Updates**: Tests updated with code changes
- **Coverage Monitoring**: Track test coverage metrics
- **Performance**: Keep tests fast and efficient
- **Documentation**: Maintain clear test documentation

## Troubleshooting

### Common Issues

1. **Mock Conflicts**: Ensure proper mock cleanup between tests
2. **Async Operations**: Use proper async/await patterns
3. **Type Errors**: Ensure test data matches expected types
4. **Environment Setup**: Verify test environment configuration

### Debug Tips

- Use `console.log` in tests for debugging (mocked in setup)
- Check mock function calls with `toHaveBeenCalledWith`
- Verify response status codes and data structure
- Use Vitest UI for interactive debugging
