import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/users.dto';
import { Users, UsersDocument } from 'src/models/users.models';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private UsersModel: Model<UsersDocument>) {}
    Add(body: UserDto ) {
        return this.UsersModel.create(body);
    }

    FindAll() {
        return this.UsersModel.find();
    }

    FindOne(id: string) {
        return this.UsersModel.findOne({_id : id}); ;
    }

    Update(id : string , body: UserDto) {
        return this.UsersModel.findByIdAndUpdate(
            { _id: id },
            {$set : body},
            { new: true },
        );
    }

    Delete(id : string) {
        return this.UsersModel.deleteOne({_id : id});
    }

    Search(key : string) {
        const keyword = key ? {
            $or: [
                { fullname: { $regex: key, $options: 'i' } },
                { email: { $regex: key, $options: 'i' } },
            ],
        } : {}
        return this.UsersModel.find(keyword) ;
    }
}
