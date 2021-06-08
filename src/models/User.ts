import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { Video } from "./Video"

export enum userMethod {
   LOCAL = "local",
   FB = "facebook",
   GOOGLE = "google",
}
@Entity()
export class User {
   @PrimaryGeneratedColumn("uuid")
   id: string

   @Column({ type: "enum", enum: userMethod, default: userMethod.LOCAL })
   method: userMethod

   @Column({ nullable: false })
   @IsNotEmpty({ message: "Please enter a name" })
   @MinLength(3, {
      message: "The name must be at least $constraint1 characters",
   })
   name: string

   @Column({ unique: true, nullable: false })
   @IsNotEmpty()
   @IsEmail()
   email: string

   @OneToMany(() => Video, video => video.user, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
   })
   videos: Video[]

   @Column()
   hash: string

   @Column()
   salt: string
}
