import {appwriteConfig, db} from "~/appwrite/client";
import {Query} from "appwrite";

export const getAllTrips = async (limit:number,offset:number) =>{
    const trips = await db.listRows(
        {
            databaseId:appwriteConfig.databaseId,
            tableId:appwriteConfig.tripCollectionId,
            queries:[
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        }
    )

    if(trips.total === 0){
        console.error("No trips found")
        return {trips:[],total:0};
    }

    return {
        trips: trips.rows,
        total:trips.total
    };
}

export const getTripById = async (tripId:string) =>{
    const trip = await db.getRow({
        databaseId:appwriteConfig.databaseId,
        tableId:appwriteConfig.tripCollectionId,
        rowId:tripId
    })

    if(!trip.$id){
        console.log("Trip not found")
        return null;
    }

    return trip;
}