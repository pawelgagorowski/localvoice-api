import AWS                                      from "aws-sdk"; 
import DynamoDB                                 from "../classes/dynamoDB";
import Params                                   from "../classes/params";
import { UsersTable, BusinessTable, 
        UserInfo }                              from "../models/types";
import logger                                   from "../config/logger";
const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

class User {
  static async findBusinessByEmail(email: string): Promise <UserInfo | boolean> {
    try {
      const paramsToQueryBusiness = Params.createParamsToQueryBusinessByEmail(email);
      const noBusinessErrorMessage = 'there is no business related to this email address';
    
      const data = await DynamoDB.queryItems<BusinessTable>(paramsToQueryBusiness, [], noBusinessErrorMessage);
      console.log("data from DB", data);
      if(data[0].business) return { business: data[0].business, userId: data[0]._id };
      return false;
    } catch(error) {
      return false;
    }
  }

  static async findUserByEmail(email: string): Promise <UserInfo | boolean> {
    try {
      const paramsToQueryBusiness = Params.createParamsToQueryUsersByEmail(email);
      const noBusinessErrorMessage = 'there is no user related to this email address';
    
      const data = await DynamoDB.queryItems<UsersTable>(paramsToQueryBusiness, [], noBusinessErrorMessage);
      if(data[0].business && data[0]._id) return { business: data[0].business, userId: data[0]._id, picture: data[0].picture };
      return false;
    } catch(error) {
      return false;
    }
  }
}

export default User;
