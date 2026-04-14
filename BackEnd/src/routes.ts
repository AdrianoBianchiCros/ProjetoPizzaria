import {Router} from 'express'
import multer from "multer";
import uploadConfig from './config/multer'
import {CreateUserController} from './controllers/user/CreateUserController'
import {createUserSchema,authUserSchema} from  './schemas/userSchema'
import {validateSchema} from "./middlewares/validateSchema";
import {AuthUserController } from './controllers/user/AuthUserController'
import {DetailUserController} from "./controllers/user/DetailUserController";
import {isAuthenticated} from "./middlewares/isAuthenticated";
import {CreateCategoryController} from "./controllers/category/CreateCategoryController";
import {ListCategoriesController} from "./controllers/category/ListCategoriesController";
import {isAdmin} from "./middlewares/isAdmin";
import {createCategorySchema, listProductsByCategorySchema} from "./schemas/categorySchema";
import {CreateProductController} from "./controllers/product/CreateProductController";
import {createProductSchema, listProductsSchema} from "./schemas/productSchema";
import {ListProductsController} from "./controllers/product/ListProductsController";
import {DeleteProductController} from "./controllers/product/DeleteProductController";
import {ListProductsByCategoryController} from "./controllers/product/ListProductsByCategoryController";
import {CreateOrderController} from "./controllers/order/CreateOrderController";
import {addItemSchema, createOrderSchema, detailOrderSchema, removeItemSchema,sendOrderSchema,finishOrderSchema,deleteOrderSchema} from "./schemas/orderSchema";
import { ListOrderController } from './controllers/order/ListOrderController';
import { AddItemController } from './controllers/order/AddItemController';
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from './controllers/order/SendOrderController';
import { FinishOrderController } from './controllers/order/FinishOrderController';
import { DeleteOrderController } from './controllers/order/DeleteOrderControlle';




const router = Router();
const upload = multer(uploadConfig)
//Rotas users
router.post("/users",validateSchema(createUserSchema),new CreateUserController().handle);

router.post("/session",validateSchema(authUserSchema), new AuthUserController().handle);

router.get("/me",isAuthenticated, new DetailUserController().handle);

//Rota category
router.get("/category/product",
    isAuthenticated,
    validateSchema(listProductsByCategorySchema),
    new ListProductsByCategoryController().handle);

router.get("/category", isAuthenticated, new ListCategoriesController().handle);

router.post("/category",
    isAuthenticated,
    isAdmin,
    validateSchema(createCategorySchema),
    new CreateCategoryController().handle);

//Rotas Produts
router.get("/products",
    isAuthenticated,
    validateSchema(listProductsSchema),
    new ListProductsController().handle);

router.post("/products",
    isAuthenticated,
    isAdmin,
    upload.single('file'),
    validateSchema(createProductSchema),
    new CreateProductController().handle);

router.delete("/products",
    isAuthenticated,
    isAdmin,
    new DeleteProductController().handle);

// Rotas order
router.post("/order",
    isAuthenticated,
    validateSchema(createOrderSchema),
    new CreateOrderController().handle);


router.get("/orders",
    isAuthenticated,
    new ListOrderController().handle);

router.post("/order/add",
    isAuthenticated,validateSchema(addItemSchema),
    new AddItemController().handle);

router.get("/order/detail",
    isAuthenticated,
    validateSchema(detailOrderSchema),
    new DetailOrderController().handle);

router.delete("/order/remove",
    isAuthenticated,
    validateSchema(removeItemSchema),
    new RemoveItemController().handle);


router.put("/order/send",
    isAuthenticated,
    validateSchema(sendOrderSchema),
    new SendOrderController().handle)

router.put("/order/finish",
    isAuthenticated,
    validateSchema(finishOrderSchema),
    new FinishOrderController().handle
)

router.delete("/order",
    isAuthenticated,
    validateSchema(deleteOrderSchema),
    new DeleteOrderController().handle)

export {router}
