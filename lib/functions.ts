import { ObjectId } from "mongodb";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function base62Encode(hexString: string): string {
    // Check if the input is valid
    if (!hexString || !/^[0-9a-fA-F]+$/.test(hexString)) {
        throw new Error("Invalid hex string");
    }

    let decimal = BigInt("0x" + hexString); // Convert the hex string to a BigInt
    let base62 = "";

    // Handle the case where the decimal is 0
    if (decimal === BigInt(0)) {
        return "0";
    }

    while (decimal > BigInt(0)) {
        const remainder = decimal % BigInt(62);
        base62 = BASE62_CHARS[Number(remainder)] + base62;
        decimal = decimal / BigInt(62);
    }

    return base62;
}


export function base62Decode(base62String: string): string {
    let decimal = BigInt(0);

    for (let i = 0; i < base62String.length; i++) {
        const index = BASE62_CHARS.indexOf(base62String[i]);
        if (index === -1) {
            throw new Error("Invalid Base62 character");
        }
        decimal = decimal * BigInt(62) + BigInt(index);
    }

    return decimal.toString(16); // Convert to hexadecimal string
}

export function getUserInteraction(userId: ObjectId, likes: ObjectId[], dislikes: ObjectId[]): number {
    if (likes.some(id => id.equals(userId))) return 1; // User liked the problem
    if (dislikes.some(id => id.equals(userId))) return 2; // User disliked the problem
    return 0; // User did nothing
}

export function calculateRelevance(likes: number, comments: number, createdAt: Date): number {
    // Weights for the factors
    const weightLikes = 0.4; // Weight for likes
    const weightComments = 0.6; // Weight for comments

    // Calculate time in days since the problem was created
    const now = new Date();
    const timeDifference = Math.max(0, now.getTime() - new Date(createdAt).getTime()); // Time in milliseconds
    const timeDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

    // Apply exponential decay function
    const decayRate = 0.1; // Rate of decay
    const timeDecay = Math.exp(-decayRate * timeDays); // Exponential decay

    // Calculate weighted engagement
    const weightedEngagement = (likes * weightLikes) + (comments * weightComments);

    // Calculate relevance with time decay
    const relevance = weightedEngagement * timeDecay;

    return relevance;
}

export function createSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}


export function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const interval = Math.floor(seconds / 31536000); // seconds in a year
  
    if (interval > 1) {
        return `${interval} years ago`;
    }
    if (interval === 1) {
        return `1 year ago`;
    }
  
    const days = Math.floor(seconds / 86400); // seconds in a day
    if (days > 1) {
        return `${days} days ago`;
    }
    if (days === 1) {
        return `1 day ago`;
    }
  
    const hours = Math.floor(seconds / 3600); // seconds in an hour
    if (hours > 1) {
        return `${hours} hours ago`;
    }
    if (hours === 1) {
        return `1 hour ago`;
    }
  
    const minutes = Math.floor(seconds / 60); // seconds in a minute
    if (minutes > 1) {
        return `${minutes} minutes ago`;
    }
    if (minutes === 1) {
        return `1 minute ago`;
    }
  
    return `just now`;
}

