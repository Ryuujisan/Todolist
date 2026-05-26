export type Workspace  = {
  id: number
  name: string
  description: string
  createdAt: string
  owner: Owner
  items: ItemView[]
}

export type Owner = {
  id: number
  name: string
}

export type ItemView  = {
  id: number
  title: string
  status: number
}