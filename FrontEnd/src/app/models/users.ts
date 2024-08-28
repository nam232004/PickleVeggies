export class Users {
    message(arg0: string, message: any) {
      throw new Error('Method not implemented.');
    }
    id!:number;
    name!:string;
    email!:string;
    password!:string;
    phone!:string;
    address!:string;
    isAdmin?:boolean;
    img!:string;
}
