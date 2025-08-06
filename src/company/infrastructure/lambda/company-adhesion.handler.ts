import { APIGatewayProxyEvent, APIGatewayProxyResult } from './types';
import { CompanyType } from '../../../shared/types/company.types';
import { initializeCompanyServices } from '../../../shared/lambda/initialization';
import { dayjs } from '../../../shared/utils/dayjs.config';

// Expected Lambda input
interface CompanyAdhesionRequest {
  cuit: string;
  name: string;
  adhesionDate: string;
  type: CompanyType;
}

// Expected Lambda output
interface CompanyAdhesionResponse {
  success: boolean;
  message: string;
  companyId?: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const companyApplicationService = await initializeCompanyServices();

    // Parse request body
    const requestBody: CompanyAdhesionRequest = JSON.parse(event.body || '{}');

    // Validate required data
    const { cuit, name, adhesionDate, type } = requestBody;
    if (!cuit || !name || !adhesionDate || !type) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: cuit, name, adhesionDate, type'
        })
      };
    }

    // Create company using existing domain logic
    const companyData = {
      cuit: requestBody.cuit,
      name: requestBody.name,
      adhesionDate: dayjs(requestBody.adhesionDate).utc().toDate(),
      type: requestBody.type,
    };
    const company = await companyApplicationService.create(companyData);

    const response: CompanyAdhesionResponse = {
      success: true,
      message: 'Company successfully adhered',
      companyId: company.id.getValue()
    };

    return {
      statusCode: 201,
      body: JSON.stringify(response)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
}; 