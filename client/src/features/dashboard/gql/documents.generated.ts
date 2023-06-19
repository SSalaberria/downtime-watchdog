import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

import * as Types from "../../../common/types.generated";

export type DashboardFragment = {
  __typename?: "Dashboard";
  trackers: Array<{
    __typename?: "Tracker";
    website: string;
    _id: string;
    monthlyAvailability: {
      __typename?: "Availability";
      uptime: number;
      status: Types.AvailabilityStatus;
    };
    trackingLogs: Array<{
      __typename?: "TrackingLog";
      status: Types.Status;
      _id: string;
      createdAt: any;
    }>;
  }>;
};

export type TrackerFragment = {
  __typename?: "Tracker";
  website: string;
  _id: string;
  monthlyAvailability: {
    __typename?: "Availability";
    uptime: number;
    status: Types.AvailabilityStatus;
  };
  trackingLogs: Array<{
    __typename?: "TrackingLog";
    status: Types.Status;
    _id: string;
    createdAt: any;
  }>;
};

export type GetUserDashboardQueryVariables = Types.Exact<{
  sinceDate?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type GetUserDashboardQuery = {
  __typename?: "Query";
  userDashboard: {
    __typename?: "Dashboard";
    trackers: Array<{
      __typename?: "Tracker";
      website: string;
      _id: string;
      monthlyAvailability: {
        __typename?: "Availability";
        uptime: number;
        status: Types.AvailabilityStatus;
      };
      trackingLogs: Array<{
        __typename?: "TrackingLog";
        status: Types.Status;
        _id: string;
        createdAt: any;
      }>;
    }>;
  };
};

export type GetDashboardQueryVariables = Types.Exact<{
  _id?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
  sinceDate?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type GetDashboardQuery = {
  __typename?: "Query";
  dashboard: {
    __typename?: "Dashboard";
    trackers: Array<{
      __typename?: "Tracker";
      website: string;
      _id: string;
      monthlyAvailability: {
        __typename?: "Availability";
        uptime: number;
        status: Types.AvailabilityStatus;
      };
      trackingLogs: Array<{
        __typename?: "TrackingLog";
        status: Types.Status;
        _id: string;
        createdAt: any;
      }>;
    }>;
  };
};

export type CreateTrackerMutationVariables = Types.Exact<{
  website: Types.Scalars["String"]["input"];
  sinceDate?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type CreateTrackerMutation = {
  __typename?: "Mutation";
  addTrackerToDashboard: {
    __typename?: "Dashboard";
    trackers: Array<{
      __typename?: "Tracker";
      website: string;
      _id: string;
      monthlyAvailability: {
        __typename?: "Availability";
        uptime: number;
        status: Types.AvailabilityStatus;
      };
      trackingLogs: Array<{
        __typename?: "TrackingLog";
        status: Types.Status;
        _id: string;
        createdAt: any;
      }>;
    }>;
  };
};

export type RemoveTrackerMutationVariables = Types.Exact<{
  _id: Types.Scalars["String"]["input"];
  sinceDate?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type RemoveTrackerMutation = {
  __typename?: "Mutation";
  removeTrackerFromDashboard: {
    __typename?: "Dashboard";
    trackers: Array<{
      __typename?: "Tracker";
      website: string;
      _id: string;
      monthlyAvailability: {
        __typename?: "Availability";
        uptime: number;
        status: Types.AvailabilityStatus;
      };
      trackingLogs: Array<{
        __typename?: "TrackingLog";
        status: Types.Status;
        _id: string;
        createdAt: any;
      }>;
    }>;
  };
};

export const TrackerFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "tracker" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Tracker" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "website" } },
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "monthlyAvailability" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uptime" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "trackingLogs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sinceDate" },
                value: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TrackerFragment, unknown>;

export const DashboardFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "dashboard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Dashboard" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "trackers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "tracker" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "tracker" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Tracker" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "website" } },
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "monthlyAvailability" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uptime" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "trackingLogs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sinceDate" },
                value: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DashboardFragment, unknown>;

export const GetUserDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } },
          defaultValue: { kind: "NullValue" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userDashboard" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "dashboard" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "tracker" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Tracker" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "website" } },
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "monthlyAvailability" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uptime" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "trackingLogs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sinceDate" },
                value: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "dashboard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Dashboard" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "trackers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "tracker" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserDashboardQuery, GetUserDashboardQueryVariables>;

export const GetDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "_id" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } },
          defaultValue: { kind: "NullValue" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "dashboard" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "_id" },
                value: { kind: "Variable", name: { kind: "Name", value: "_id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "dashboard" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "tracker" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Tracker" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "website" } },
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "monthlyAvailability" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uptime" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "trackingLogs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sinceDate" },
                value: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "dashboard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Dashboard" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "trackers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "tracker" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetDashboardQuery, GetDashboardQueryVariables>;

export const CreateTrackerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateTracker" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "website" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } },
          defaultValue: { kind: "NullValue" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addTrackerToDashboard" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "AddTrackerInput" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "website" },
                      value: { kind: "Variable", name: { kind: "Name", value: "website" } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "dashboard" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "tracker" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Tracker" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "website" } },
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "monthlyAvailability" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uptime" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "trackingLogs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sinceDate" },
                value: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "dashboard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Dashboard" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "trackers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "tracker" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTrackerMutation, CreateTrackerMutationVariables>;

export const RemoveTrackerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveTracker" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "_id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } },
          defaultValue: { kind: "NullValue" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeTrackerFromDashboard" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "RemoveTrackerInput" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "trackerId" },
                      value: { kind: "Variable", name: { kind: "Name", value: "_id" } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "dashboard" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "tracker" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Tracker" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "website" } },
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "monthlyAvailability" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uptime" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "trackingLogs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sinceDate" },
                value: { kind: "Variable", name: { kind: "Name", value: "sinceDate" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "dashboard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Dashboard" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "trackers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "tracker" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveTrackerMutation, RemoveTrackerMutationVariables>;