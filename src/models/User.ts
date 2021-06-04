import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { Video } from "./Video"
@Entity()
export class User {
   @PrimaryGeneratedColumn("uuid")
   id: string

   @Column({ nullable: false })
   @IsNotEmpty({ message: "Please enter a name" })
   @MinLength(3, {
      message: "The name must be at least $constraint1 characters",
   })
   name: string

   @Column({ unique: true, nullable: false })
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
