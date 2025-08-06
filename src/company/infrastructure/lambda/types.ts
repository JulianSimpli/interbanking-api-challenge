// Basic types for AWS Lambda without external dependencies
export interface APIGatewayProxyEvent {
  body: string | null;
  headers: Record<string, string>;
  httpMethod: string;
  path: string;
  queryStringParameters: Record<string, string> | null;
}

export interface APIGatewayProxyResult {
  statusCode: number;
  body: string;
} 