// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT
import type { NonAttribute } from 'sequelize'
import type * as Models from '@/types/models'
import type { Model, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, HasOneCreateAssociationMixin } from 'sequelize'

type MagicModel<M, AttrsOmit extends keyof InferAttributes<M> = never, CreationAttrsOmit extends keyof InferCreationAttributes<M> = never> = Model<InferAttributes<M, { omit: 'createdAt' | 'updatedAt' | AttrsOmit }>, InferCreationAttributes<M, { omit: 'createdAt' | 'updatedAt' | CreationAttrsOmit }>>

interface Timestamps { createdAt: Date; updatedAt: Date }

declare module "@/types/models" {
  interface Candidate extends MagicModel<Candidate, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Candidate HasMany Vote

    //* Properties
    votes: NonAttribute<Models.Vote[]>


    //* Mixins
    getVotes: HasManyGetAssociationsMixin<Models.Vote>
    addVote: HasManyAddAssociationMixin<Models.Vote, Models.Vote['id']>
    addVotes: HasManyAddAssociationsMixin<Models.Vote, Models.Vote['id']>
    createVote: HasManyCreateAssociationMixin<Vote>
    
    //Tl Candidate HasMany Objective

    //* Properties
    objectives: NonAttribute<Models.Objective[]>


    //* Mixins
    getObjectives: HasManyGetAssociationsMixin<Models.Objective>
    addObjective: HasManyAddAssociationMixin<Models.Objective, Models.Objective['id']>
    addObjectives: HasManyAddAssociationsMixin<Models.Objective, Models.Objective['id']>
    createObjective: HasManyCreateAssociationMixin<Objective>
    
    //Tl Candidate BelongsTo User

    //* Properties
    user: NonAttribute<Models.User>


    //* Mixins
    getUser: BelongsToGetAssociationMixin<User>
    setUser: BelongsToSetAssociationMixin<User, Models.User['id']>
    createUser: BelongsToCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface Config extends MagicModel<Config, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
  }
}

declare module "@/types/models" {
  interface DeviceToken extends MagicModel<DeviceToken, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl DeviceToken BelongsTo User

    //* Properties
    user: NonAttribute<Models.User>


    //* Mixins
    getUser: BelongsToGetAssociationMixin<User>
    setUser: BelongsToSetAssociationMixin<User, Models.User['id']>
    createUser: BelongsToCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface Election extends MagicModel<Election, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Election HasMany Vote

    //* Properties
    votes: NonAttribute<Models.Vote[]>


    //* Mixins
    getVotes: HasManyGetAssociationsMixin<Models.Vote>
    addVote: HasManyAddAssociationMixin<Models.Vote, Models.Vote['id']>
    addVotes: HasManyAddAssociationsMixin<Models.Vote, Models.Vote['id']>
    createVote: HasManyCreateAssociationMixin<Vote>
    
    //Tl Election BelongsTo ShiftType

    //* Properties
    shiftType: NonAttribute<Models.ShiftType>


    //* Mixins
    getShiftType: BelongsToGetAssociationMixin<ShiftType>
    setShiftType: BelongsToSetAssociationMixin<ShiftType, Models.ShiftType['id']>
    createShiftType: BelongsToCreateAssociationMixin<ShiftType>
    
  }
}

declare module "@/types/models" {
  interface Objective extends MagicModel<Objective, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Objective BelongsTo Candidate

    //* Properties
    candidate: NonAttribute<Models.Candidate>


    //* Mixins
    getCandidate: BelongsToGetAssociationMixin<Candidate>
    setCandidate: BelongsToSetAssociationMixin<Candidate, Models.Candidate['id']>
    createCandidate: BelongsToCreateAssociationMixin<Candidate>
    
  }
}

declare module "@/types/models" {
  interface PasswordReset extends MagicModel<PasswordReset, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl PasswordReset BelongsTo User

    //* Properties
    user: NonAttribute<Models.User>


    //* Mixins
    getUser: BelongsToGetAssociationMixin<User>
    setUser: BelongsToSetAssociationMixin<User, Models.User['id']>
    createUser: BelongsToCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface Profile extends MagicModel<Profile, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Profile BelongsTo User

    //* Properties
    user: NonAttribute<Models.User>


    //* Mixins
    getUser: BelongsToGetAssociationMixin<User>
    setUser: BelongsToSetAssociationMixin<User, Models.User['id']>
    createUser: BelongsToCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface Role extends MagicModel<Role, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Role HasMany User

    //* Properties
    users: NonAttribute<Models.User[]>


    //* Mixins
    getUsers: HasManyGetAssociationsMixin<Models.User>
    addUser: HasManyAddAssociationMixin<Models.User, Models.User['id']>
    addUsers: HasManyAddAssociationsMixin<Models.User, Models.User['id']>
    createUser: HasManyCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface Session extends MagicModel<Session, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Session BelongsTo User

    //* Properties
    user: NonAttribute<Models.User>


    //* Mixins
    getUser: BelongsToGetAssociationMixin<User>
    setUser: BelongsToSetAssociationMixin<User, Models.User['id']>
    createUser: BelongsToCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface ShiftType extends MagicModel<ShiftType, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl ShiftType HasMany Election

    //* Properties
    elections: NonAttribute<Models.Election[]>


    //* Mixins
    getElections: HasManyGetAssociationsMixin<Models.Election>
    addElection: HasManyAddAssociationMixin<Models.Election, Models.Election['id']>
    addElections: HasManyAddAssociationsMixin<Models.Election, Models.Election['id']>
    createElection: HasManyCreateAssociationMixin<Election>
    
    //Tl ShiftType HasMany User

    //* Properties
    users: NonAttribute<Models.User[]>


    //* Mixins
    getUsers: HasManyGetAssociationsMixin<Models.User>
    addUser: HasManyAddAssociationMixin<Models.User, Models.User['id']>
    addUsers: HasManyAddAssociationsMixin<Models.User, Models.User['id']>
    createUser: HasManyCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface TypeDocument extends MagicModel<TypeDocument, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl TypeDocument HasMany User

    //* Properties
    users: NonAttribute<Models.User[]>


    //* Mixins
    getUsers: HasManyGetAssociationsMixin<Models.User>
    addUser: HasManyAddAssociationMixin<Models.User, Models.User['id']>
    addUsers: HasManyAddAssociationsMixin<Models.User, Models.User['id']>
    createUser: HasManyCreateAssociationMixin<User>
    
  }
}

declare module "@/types/models" {
  interface User extends MagicModel<User, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl User BelongsTo TypeDocument

    //* Properties
    typeDocument: NonAttribute<Models.TypeDocument>


    //* Mixins
    getTypeDocument: BelongsToGetAssociationMixin<TypeDocument>
    setTypeDocument: BelongsToSetAssociationMixin<TypeDocument, Models.TypeDocument['id']>
    createTypeDocument: BelongsToCreateAssociationMixin<TypeDocument>
    
    //Tl User HasMany Vote

    //* Properties
    votes: NonAttribute<Models.Vote[]>


    //* Mixins
    getVotes: HasManyGetAssociationsMixin<Models.Vote>
    addVote: HasManyAddAssociationMixin<Models.Vote, Models.Vote['id']>
    addVotes: HasManyAddAssociationsMixin<Models.Vote, Models.Vote['id']>
    createVote: HasManyCreateAssociationMixin<Vote>
    
    //Tl User HasMany DeviceToken

    //* Properties
    deviceTokens: NonAttribute<Models.DeviceToken[]>


    //* Mixins
    getDeviceTokens: HasManyGetAssociationsMixin<Models.DeviceToken>
    addDeviceToken: HasManyAddAssociationMixin<Models.DeviceToken, Models.DeviceToken['id']>
    addDeviceTokens: HasManyAddAssociationsMixin<Models.DeviceToken, Models.DeviceToken['id']>
    createDeviceToken: HasManyCreateAssociationMixin<DeviceToken>
    
    //Tl User BelongsTo Role

    //* Properties
    role: NonAttribute<Models.Role>


    //* Mixins
    getRole: BelongsToGetAssociationMixin<Role>
    setRole: BelongsToSetAssociationMixin<Role, Models.Role['id']>
    createRole: BelongsToCreateAssociationMixin<Role>
    
    //Tl User HasMany PasswordReset

    //* Properties
    passwordResets: NonAttribute<Models.PasswordReset[]>


    //* Mixins
    getPasswordResets: HasManyGetAssociationsMixin<Models.PasswordReset>
    addPasswordReset: HasManyAddAssociationMixin<Models.PasswordReset, Models.PasswordReset['id']>
    addPasswordResets: HasManyAddAssociationsMixin<Models.PasswordReset, Models.PasswordReset['id']>
    createPasswordReset: HasManyCreateAssociationMixin<PasswordReset>
    
    //Tl User HasMany Session

    //* Properties
    sessions: NonAttribute<Models.Session[]>


    //* Mixins
    getSessions: HasManyGetAssociationsMixin<Models.Session>
    addSession: HasManyAddAssociationMixin<Models.Session, Models.Session['id']>
    addSessions: HasManyAddAssociationsMixin<Models.Session, Models.Session['id']>
    createSession: HasManyCreateAssociationMixin<Session>
    
    //Tl User HasOne Profile

    //* Properties
    profile: NonAttribute<Models.Profile>


    //* Mixins
    getProfile: HasOneGetAssociationMixin<Profile>
    setProfile: HasOneSetAssociationMixin<Profile, Models.Profile['id']>
    createProfile: HasOneCreateAssociationMixin<Profile>
    
    //Tl User HasOne Candidate

    //* Properties
    candidate: NonAttribute<Models.Candidate>


    //* Mixins
    getCandidate: HasOneGetAssociationMixin<Candidate>
    setCandidate: HasOneSetAssociationMixin<Candidate, Models.Candidate['id']>
    createCandidate: HasOneCreateAssociationMixin<Candidate>
    
    //Tl User BelongsTo ShiftType

    //* Properties
    shiftType: NonAttribute<Models.ShiftType>


    //* Mixins
    getShiftType: BelongsToGetAssociationMixin<ShiftType>
    setShiftType: BelongsToSetAssociationMixin<ShiftType, Models.ShiftType['id']>
    createShiftType: BelongsToCreateAssociationMixin<ShiftType>
    
  }
}

declare module "@/types/models" {
  interface Vote extends MagicModel<Vote, 'createdAt' | 'updatedAt', 'createdAt' | 'updatedAt'>, Timestamps {
    //Tl Vote BelongsTo Candidate

    //* Properties
    candidate: NonAttribute<Models.Candidate>


    //* Mixins
    getCandidate: BelongsToGetAssociationMixin<Candidate>
    setCandidate: BelongsToSetAssociationMixin<Candidate, Models.Candidate['id']>
    createCandidate: BelongsToCreateAssociationMixin<Candidate>
    
    //Tl Vote BelongsTo User

    //* Properties
    user: NonAttribute<Models.User>


    //* Mixins
    getUser: BelongsToGetAssociationMixin<User>
    setUser: BelongsToSetAssociationMixin<User, Models.User['id']>
    createUser: BelongsToCreateAssociationMixin<User>
    
    //Tl Vote BelongsTo Election

    //* Properties
    election: NonAttribute<Models.Election>


    //* Mixins
    getElection: BelongsToGetAssociationMixin<Election>
    setElection: BelongsToSetAssociationMixin<Election, Models.Election['id']>
    createElection: BelongsToCreateAssociationMixin<Election>
    
  }
}
