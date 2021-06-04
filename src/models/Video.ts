import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Video {
   @PrimaryGeneratedColumn()
   id: number

   @Column()
   videoId: string

   @Column()
   title: string

   @ManyToOne(() => User, user => user.videos, {
      nullable: false,
   })
   user: User
}
