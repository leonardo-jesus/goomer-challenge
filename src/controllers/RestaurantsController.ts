import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
const isEmpty = require('lodash.isempty');

import * as Yup from 'yup';

import Restaurant from '../models/Restaurant';
import ImageRestaurant from '../models/ImageRestaurant';

export default {
  async index(req: Request, res: Response) {
    const restaurantsRepository = getRepository(Restaurant);

    const restaurants = await restaurantsRepository.find({
      relations: ['images']
    });

    return res.json(restaurants);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const restaurantsRepository = getRepository(Restaurant);

    const restaurant = await restaurantsRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return res.json(restaurant);
  },

  async create(req: Request, res: Response) {
    const {
      name,
      longitude,
      latitude,
      about,
      opening_hours,
    } = req.body;

    const restaurantsRepository = getRepository(Restaurant);

    const reqImages = req.files as Express.Multer.File[];
    const images = reqImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      longitude,
      latitude,
      about,
      opening_hours,
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      opening_hours: Yup.string().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const restaurant = restaurantsRepository.create(data);

    await restaurantsRepository.save(restaurant);

    return res.status(201).json(restaurant);
  },

  async update(req: Request, res: Response) {
    let {
      name,
      longitude,
      latitude,
      about,
      opening_hours,
    } = req.body;

    const { id } = req.params;

    const restaurantsRepository = getRepository(Restaurant);
    const imagesRestaurantRepository = getRepository(ImageRestaurant);
    
    const reqImages = req.files as Express.Multer.File[];

    const images = reqImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      longitude,
      latitude,
      about,
      opening_hours
    };

    const updatedRestaurant = restaurantsRepository.create(data);

    const updatedImagesRestaurant = images.map(image => {
      return imagesRestaurantRepository.create({
        path: image.path,
        restaurant: {
          id: Number(id)
        }
      });
    });

    if (!Object.values(data).every(isEmpty)) {
      await restaurantsRepository.update(id, updatedRestaurant);
    };

    if (!isEmpty(images)) {
      await imagesRestaurantRepository.delete({
        restaurant: {
          id: Number(id)
        }
      });

      await imagesRestaurantRepository.save(updatedImagesRestaurant);
    }

    const restaurant = await restaurantsRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return res.status(200).json(restaurant);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const restaurantsRepository = getRepository(Restaurant);
    const restaurant = await restaurantsRepository.findOne(id);

    await restaurantsRepository.delete(id);

    return res.status(200).json(restaurant);
  }
};
