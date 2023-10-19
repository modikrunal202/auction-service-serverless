import { closeAuction } from "./closeAuction";
import { getEndedAuctions } from "./getEndedAuctions"


export const processAuction = async (event) => {
    try {
        const auctionsToClose = await getEndedAuctions();
        const closePromises = auctionsToClose.map((auction) => closeAuction(auction));
        await Promise.all(closePromises);
        return { closed: closePromises.length }
    } catch (error) {
        console.error(error)
    }

}