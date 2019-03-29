import faker from 'faker';
import models from '../../models';

const data = async (props = {}) => {
    const defaultProps = {
        location: faker.lorem.word(),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        duration: faker.random.number(),
        hideFromBounding: faker.random.boolean(),
    };
    return Object.assign({}, defaultProps, props);
};

export default async (props = {}) =>
  models.User.create(await data(props));