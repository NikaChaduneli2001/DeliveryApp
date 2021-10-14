export interface UsersInterface {
  id: number;
  fullName: string;
  phoneNumber?: Number;
  email?: string;
  hash?: string;
  address: string;
  isDeleted?: boolean;
  role: string;
}

export function createUserInterface(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    address: user.address,
  };
}
