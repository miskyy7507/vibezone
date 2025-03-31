import UserModel from "../models/user.model.js";
import { IUser } from "../interfaces/user.interface.js";

export default class UserService {
    // public async createNewOrUpdate(user: IUser) {
    //     console.log(user);
    //     try {
    //         if (!user._id) {
    //             const dataModel = new UserModel(user);
    //             return await dataModel.save();
    //         } else {
    //             return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
    //         }
    //     } catch (error) {
    //         console.error("Wystąpił błąd podczas tworzenia danych:", error);
    //         throw new Error("Wystąpił błąd podczas tworzenia danych");
    //     }
    // }

    public async getByLogin(login: string) {
        return await UserModel.findOne({ email: login });
    }
}
