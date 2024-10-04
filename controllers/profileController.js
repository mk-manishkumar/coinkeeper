import Amount from "../models/amount.model.js";
import User from "../models/user.model.js";

export const displayProfile = async (req, res) => {
  try {
    const username = req.params;
    console.log(username);

    const user = await User.findOne(username);
    console.log(user);

    res.render("profile", { fullname: user.fullname, totalAmount: 0, savingsTotal: 0, expenditureTotal: 0, investmentTotal: 0, expenses: 0 });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
