// import {handler} from "../services/hello";

import {handler} from "../services/spaces/handler";

// ENV VARS for ts-node running
process.env.AWS_REGION = "us-east-1";
process.env.TABLE_NAME = "SpaceTable-0affdaaf2599";

//POST item
handler({
  httpMethod: 'POST',
  body: JSON.stringify({
    location: 'Awesome City',
    name: 'my-space'
  })
} as any, {} as any)
  .then(result => console.log(result));

// GET items
// handler({
//   httpMethod: 'GET',
// } as any, {} as any);

// Get item by id
/*
handler({
  httpMethod: 'GET',
  queryStringParameters: {
    id: 'ffef4bf8-06a7-4ab2-b6cd-6c8910947f32'
  }
} as any, {} as any);*/

// Put space item
/*handler({
  httpMethod: 'PUT',
  queryStringParameters: {
    id: 'ffef4bf8-06a7-4ab2-b6cd-6c8910947f32'
  },
  body: JSON.stringify({location: 'Awesome City ALTISIMO'})
} as any, {} as any);*/

// Delete space
// Get item by id
/*
handler({
  httpMethod: 'DELETE',
  queryStringParameters: {
    id: 'f3cddce2-3c0a-49fe-b825-65d6ee569cd3'
  }
} as any, {} as any);*/
