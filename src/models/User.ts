import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

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

   @Column("simple-array")
   videosId: string[]

   @Column()
   hash: string

   @Column()
   salt: string
}
