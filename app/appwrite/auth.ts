import {account, appwriteConfig, database, db} from "~/appwrite/client";
import {ID, OAuthProvider, Query} from "appwrite";
import {redirect} from "react-router";

export const loginWithGoogle = async () => {
    try{
        account.createOAuth2Session({
            provider:OAuthProvider.Google
        });
    }catch(error){
        console.log("logInWithGoogle",error);
    }
}

export const logOut = async () => {
    try{

    }catch(error){
        console.log(error);
    }
}

export const getUser = async () => {
    try{
        const user = await account.get();

        if(!user) return redirect('/sign-in');

        const {rows} = await db.listRows({
                databaseId:appwriteConfig.databaseId,
                tableId: appwriteConfig.userCollectionId,
                queries:[
                    Query.equal('accountId',user.$id),
                    Query.select(['name','email','imageUrl','joinedAt','accountId'])
                ]
            }
        )

        return rows.length > 0 ? rows[0] : redirect("/sign-injm");
    }catch(error){
        console.log(error);
    }
}

export const getGoogleAvatar = async (accessToken : string) => {
    try{
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { photos } = await response.json();
        return photos?.[0]?.url || null;
    }catch(error){
        console.log(error);
    }
}

export const saveUserData = async () => {
    try{
        const user = await account.get();
        if(!user) throw new Error("User not found");
        const {providerAccessToken} = (await account.getSession({sessionId:"current"})) || {}
        const avatar = providerAccessToken ? await getGoogleAvatar(providerAccessToken) : null;

        const createdUser = await db.createRow(
            {
                databaseId:appwriteConfig.databaseId,
                tableId:appwriteConfig.userCollectionId,
                rowId:ID.unique(),
                data:{
                    accountId: user.$id,
                    email: user.email,
                    name: user.name,
                    imageUrl: avatar,
                    joinedAt: new Date().toISOString(),
                }
            })

        if(!createdUser.$id) redirect("/sign-in");
    }catch(error){
        console.log(error);
    }
}

export const getExistingUser = async (id: string) => {
    try{
        const {rows,total} = await db.listRows({
            databaseId:appwriteConfig.databaseId,
            tableId:appwriteConfig.userCollectionId,
            queries:[Query.equal("accountId",id)]
        });

        return total>0 ? rows[0] :null;
    }catch(error){
        console.log("Error fetching user",error);
        return null;
    }
}