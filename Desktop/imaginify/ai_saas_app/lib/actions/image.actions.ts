"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from 'cloudinary'

const populateUser = (query: any) => query.populate({
  path: 'author',
  model: User,
  select: '_id firstName lastName clerkId'
})

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("User not found");
    }
                    
    const newImage = await Image.create({
      ...image,
      author: author._id,
    })

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error)
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error)
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/')
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();
// we have to get the data of the user which created this image
    const image = await populateUser(Image.findById(imageId));

    if(!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error)
  }
}

// GET IMAGES
//  The limit parameter defaults to 9, page defaults to 1, and searchQuery defaults to an empty string.
// and if their values are given then that value will be taken
export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
// An expression string is initialized to filter images stored in the Cloudinary folder named 'imaginify'.
    let expression = 'folder=imaginify';
// If a searchQuery is provided, it is appended to the expression string with an 'AND' clause to further filter the search results.
    if (searchQuery) {
      expression += ` AND ${searchQuery}`
    }
// performs a search on Cloudinary using the constructed expression. The search results are stored in the resources variable.
    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();
// public_id of each resource (image) from the search results is extracted and stored in the resourceIds array.
    const resourceIds = resources.map((resource: any) => resource.public_id);
//An empty query object is initialized. If a searchQuery is provided, the query object is populated to match documents where the publicId field is in the resourceIds array.
    let query = {};

    if(searchQuery) {
      query = {
        publicId: {
          $in: resourceIds
        }
      }
    }
// it skips the images depending on the page number. suppose if page is 2 and limit is 1 then it skips the first 9 images and rendsers the next 9 images.
    const skipAmount = (Number(page) -1) * limit;
//   The Image model is queried using the query object. The results are sorted by the updatedAt field in descending order, skipping the calculated number of documents, and limited to the limit value. The populateUser function is used to populate user data for each image.
    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);
    // counting the number of images
    const totalImages = await Image.find(query).countDocuments();
    // counting the number of images saved by the current user
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    }
  } catch (error) {
    handleError(error)
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}