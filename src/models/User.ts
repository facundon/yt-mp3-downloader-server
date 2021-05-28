import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { IsEmail } from "class-validator"

@Entity()
export class User {
   @PrimaryGeneratedColumn("uuid")
   id: string

   @Column()
   name: string

   @Column({ unique: true })
   @IsEmail()
   email: string

   @Column("simple-array")
   videosId: string[]

   @Column()
   hash: string

   @Column()
   salt: string
}
