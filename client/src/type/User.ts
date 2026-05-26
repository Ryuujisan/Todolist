export type User = {
    id: number
    email: string
    name: string
    descriptions: string
    workspaces: WorkspaceView[]
    createdAt: string
    updatedAt: string
}

export type WorkspaceView = {
    id: number
    name: string
    description: string
}

export type AuthData = {email: string, password: string}