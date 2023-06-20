export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddTrackerInput = {
  /** Website url to be tracked */
  website: Scalars['String']['input'];
};

export type Availability = {
  __typename?: 'Availability';
  /** Availability status of the tracker */
  status: AvailabilityStatus;
  /** Availability threshold of the tracker */
  uptime: Scalars['Float']['output'];
};

/** Availability status of the tracker */
export enum AvailabilityStatus {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Unknown = 'UNKNOWN'
}

export type ConnectionArgs = {
  /** Paginate after opaque cursor */
  after?: InputMaybe<Scalars['String']['input']>;
  /** Paginate before opaque cursor */
  before?: InputMaybe<Scalars['String']['input']>;
  /** Paginate first */
  first?: InputMaybe<Scalars['Float']['input']>;
  /** Paginate last */
  last?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateDashboardInput = {
  /** Owner of dashboard */
  owner: Scalars['String']['input'];
};

export type CreateUserInput = {
  /** User's email */
  email: Scalars['String']['input'];
  /** User's name */
  name: Scalars['String']['input'];
  /** User's password */
  password: Scalars['String']['input'];
};

export type Dashboard = {
  __typename?: 'Dashboard';
  _id: Scalars['String']['output'];
  /** Owner of dashboard */
  owner: User;
  /** Trackers on dashboard */
  trackers: Array<Tracker>;
};

export type LoggedUserOutput = {
  __typename?: 'LoggedUserOutput';
  /** Generated access_token of the user */
  access_token: Scalars['String']['output'];
  /** Generated refresh_token of the user */
  refresh_token: Scalars['String']['output'];
};

export type LoginUserInput = {
  /** Email */
  email: Scalars['String']['input'];
  /** Password */
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addTrackerToDashboard: Dashboard;
  createDashboard: Dashboard;
  createUser: User;
  jwtRefresh: LoggedUserOutput;
  login: LoggedUserOutput;
  register: LoggedUserOutput;
  removeTracker: Tracker;
  removeTrackerFromDashboard: Dashboard;
  updateUser: User;
};


export type MutationAddTrackerToDashboardArgs = {
  AddTrackerInput: AddTrackerInput;
};


export type MutationCreateDashboardArgs = {
  createDashboardInput: CreateDashboardInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationJwtRefreshArgs = {
  refreshJwtInput: RefreshJwtInput;
};


export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationRegisterArgs = {
  createUserInput: CreateUserInput;
};


export type MutationRemoveTrackerArgs = {
  _id: Scalars['String']['input'];
};


export type MutationRemoveTrackerFromDashboardArgs = {
  RemoveTrackerInput: RemoveTrackerInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type PageDataDto = {
  __typename?: 'PageDataDto';
  count: Scalars['Float']['output'];
  limit: Scalars['Float']['output'];
  offset: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  dashboard: Dashboard;
  findAll: UsersResponse;
  findById: User;
  tracker: Tracker;
  user: User;
  userDashboard: Dashboard;
};


export type QueryDashboardArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFindAllArgs = {
  args: ConnectionArgs;
};


export type QueryFindByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryTrackerArgs = {
  _id: Scalars['String']['input'];
};

export type RefreshJwtInput = {
  refresh_token: Scalars['String']['input'];
};

export type RemoveTrackerInput = {
  /** ID of tracker to be removed from dashboard */
  trackerId: Scalars['String']['input'];
};

/** Status of the tracker */
export enum Status {
  Down = 'DOWN',
  Unknown = 'UNKNOWN',
  Untracked = 'UNTRACKED',
  Up = 'UP'
}

export type Tracker = {
  __typename?: 'Tracker';
  /** Unique identifier of the tracker */
  _id: Scalars['String']['output'];
  /** Availability of the tracker */
  monthlyAvailability: Availability;
  /** Tracking logs of the tracker */
  trackingLogs: Array<TrackingLog>;
  /** Website url to be tracked */
  website: Scalars['String']['output'];
};


export type TrackerTrackingLogsArgs = {
  sinceDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TrackingLog = {
  __typename?: 'TrackingLog';
  /** Unique identifier of the tracking log */
  _id: Scalars['String']['output'];
  /** Date of the tracking log */
  createdAt: Scalars['DateTime']['output'];
  /** Registered status */
  status: Status;
  /** Tracker ID */
  tracker: Scalars['String']['output'];
};

export type UpdateUserInput = {
  /** User's email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** User's name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** User's password */
  password?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String']['output'];
  /** Dashboard of user */
  dashboard: Dashboard;
  /** Email */
  email: Scalars['String']['output'];
  /** Username */
  name: Scalars['String']['output'];
  /** Roles */
  roles: Array<Scalars['String']['output']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<UserEdge>>;
  pageInfo?: Maybe<UserPageInfo>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<User>;
};

export type UserPageInfo = {
  __typename?: 'UserPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  page: UserConnection;
  pageData?: Maybe<PageDataDto>;
};
