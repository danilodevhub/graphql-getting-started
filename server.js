const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construindo um schema, usando GraphQL schema language
const schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    dieSides: [DieSide]
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type DieSide {
    side: Int!
    description: String!
  }

  type Query {
    playDie(numSides: Int): RandomDie
  }
`);

// Essa class implementa a RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    //field simples 
    this.numSides = numSides;
    
    //field simples 
    this.dieSides = [];

    //criacao dos lados do dado
    for (let i = 0; i < numSides; i++) {
      this.dieSides.push(new DieSide(i+1));
    }
  }
  
  //implementacao do resolve para o field rollOnde
  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  //implementacao do resolve para o field roll
  roll({numRolls}) {
    const output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// Essa class implementa a DieSide GraphQL type
class DieSide {
  constructor(side) {
    this.side = side;
  }

  description() {
    return `Este é o lado do numero ${this.side}`;
  }
}

// The root provides the top-level API endpoints
// definição e implementação das queries
const query = {
  playDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  }
}

// Expondo a API via server HTTP express e express-graphql
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: query,
  graphiql: true, 
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');