import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import {LambdaIntegration} from "aws-cdk-lib/aws-apigateway";
import {ITable} from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {

  public readonly spacesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    /*
    const helloLambda = new NodejsFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, "./../..", "services", "hello.ts"),
      environment: {
        TABLE_NAME: props.spacesTable.tableName
      }
    });

    helloLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:ListAllMyBuckets',
        's3:ListBuckets'
      ],
      resources: ['*'] //bad practice
    }))

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
     */

    const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (path.join(__dirname, '../..', 'services', 'spaces', 'handler.ts')),
      environment: {
        TABLE_NAME: props.spacesTable.tableName
      }
    });

    spacesLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.spacesTable.tableArn],
      actions: [
        'dynamodb:PutItem',
        'dynamodb:GetItem',
        'dynamodb:Scan',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
      ]
    }));

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}