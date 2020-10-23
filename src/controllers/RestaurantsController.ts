import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
const isEmpty = require('lodash.isempty');

import * as Yup from 'yup';

import Restaurant from '../models/Restaurant';
import ImagesRestaurant from '../models/ImagesRestaurant';

export default {
  async indexRestaurant(req: Request, res: Response) {
    const restaurantsRepository = getRepository(Restaurant);

    const restaurants = await restaurantsRepository.find({
      relations: ['imagesRestaurant']
    });

    return res.json(restaurants);
  },

  async showRestaurant(req: Request, res: Response) {
    const { id } = req.params;

    const restaurantsRepository = getRepository(Restaurant);

    const restaurant = await restaurantsRepository.findOneOrFail(id, {
      relations: ['imagesRestaurant']
    });

    return res.json(restaurant);
  },

  async createRestaurant(req: Request, res: Response) {
    const {
      name,
      longitude,
      latitude,
      about,
      opening_hours,
    } = req.body;

    const restaurantsRepository = getRepository(Restaurant);

    const reqImages = req.files as Express.Multer.File[];
    const imagesRestaurant = reqImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      longitude,
      latitude,
      about,
      opening_hours,
      imagesRestaurant
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      opening_hours: Yup.string().required(),
      imagesRestaurant: Yup.array(
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

  async updateRestaurant(req: Request, res: Response) {
    let {
      name,
      longitude,
      latitude,
      about,
      opening_hours,
    } = req.body;

    const { id } = req.params;

    const restaurantsRepository = getRepository(Restaurant);
    const imagesRestaurantRepository = getRepository(ImagesRestaurant);
    
    const reqImages = req.files as Express.Multer.File[];

    const imagesRestaurant = reqImages.map(image => {
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

    const updatedImagesRestaurant = imagesRestaurant.map(image => {
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

    if (!isEmpty(imagesRestaurant)) {
      await imagesRestaurantRepository.delete({
        restaurant: {
          id: Number(id)
        }
      });

      await imagesRestaurantRepository.save(updatedImagesRestaurant);
    }

    const restaurant = await restaurantsRepository.findOneOrFail(id, {
      relations: ['imagesRestaurant']
    });

    return res.status(200).json(restaurant);
  },

  async deleteRestaurant(req: Request, res: Response) {
    const { id } = req.params;

    const restaurantsRepository = getRepository(Restaurant);
    const restaurant = await restaurantsRepository.findOne(id);

    await restaurantsRepository.delete(id);

    return res.status(200).json(restaurant);
  },


};
