// src/queries/queries.js
import { gql } from "@apollo/client";

export const GET_USER_INFO = gql`
  query {
    user {
      id
      login
      email
      attrs
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query {
    transaction(
      where: {
        type: { _eq: "xp" }
        _or: [
          { object: { type: { _eq: "project" } } }
          {
            object: { type: { _eq: "exercise" } }
            event: { path: { _eq: "/bahrain/bh-module" } }
          }
        ]
      }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

export const GET_TOTAL_XP = gql`
  query {
    transaction_aggregate(
      where: {
        event: { path: { _eq: "/bahrain/bh-module" } }
        type: { _eq: "xp" }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

export const GET_AUDITS = gql`
  query {
    user {
      validAudits: audits_aggregate(
        where: { grade: { _gte: 1 } }
        order_by: { createdAt: desc }
      ) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
      failedAudits: audits_aggregate(
        where: { grade: { _lt: 1 } }
        order_by: { createdAt: desc }
      ) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
    }
  }
`;

export const GET_AUDIT_STATS = gql`
  query {
    user {
      auditRatio
      totalUp
      totalDown
    }
  }
`;

export const GET_TECHNICAL_SKILLS = gql`
  query {
    transaction(
      where: {
        _and: [
          { type: { _ilike: "%skill%" } }
          { object: { type: { _eq: "project" } } }
        ]
      }
      order_by: [{ type: asc }, { createdAt: desc }]
      distinct_on: type
    ) {
      amount
      type
    }
  }
`;

export const GET_TOP_TRANSACTION = gql`
  query {
    transaction(
      order_by: { amount: desc }
      limit: 1
      where: { type: { _eq: "level" }, path: { _like: "/bahrain/bh-module%" } }
    ) {
      amount
    }
  }
`;
