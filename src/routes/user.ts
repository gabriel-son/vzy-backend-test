import { updateUser } from "@controllers/index";
import * as Api from "@components/api";
import { authenticateAccessToken } from "@middlewares/authentication";
import { UpdateUser } from "@middlewares/validators/User";

export default Api.load({
	put: [["/:id", [authenticateAccessToken], [...UpdateUser], updateUser]],
});
