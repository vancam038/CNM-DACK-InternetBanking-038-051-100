import React, { Component } from "react";
import axios from "axios";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Message from "./Message";

export default class PayIn extends Component {
  state = {
    payInAmount: 0,
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: ""
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleEnterKeyup);
  };

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit form pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handlePayIn();

  handleInputChange = e => {
    const { name, value } = e.target;
    if (isNaN(value)) return;
    this.setState({ [name]: value });
  };

  handlePayIn = () => {
    const { payInAmount } = this.state;
    const { payAccId, currentBalance } = this.props;

    if (
      payAccId === null ||
      currentBalance === null ||
      payInAmount === null ||
      isNaN(currentBalance) ||
      isNaN(payInAmount)
    )
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Something went wrong when getting the pay in information"
      });

    if (+payInAmount === 0)
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "The amount must be greater than 0"
      });

    axios
      .patch("http://localhost:3001/pay-acc/balance", {
        payAccId,
        newBalance: +currentBalance + +payInAmount
      })
      .then(resp => {
        const { status } = resp;
        if (status) {
          this.setState({
            messageType: "success",
            isMessageOpen: true,
            message: "The pay in has been succeed"
          });
          this.props.onPayInSucceed();
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed submitting new balance"
          });
          throw new Error(
            "Something went wrong when  submitting new balance, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed submitting new balance"
        });
        console.log(err);
      });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  render() {
    const { isMessageOpen, messageType, message } = this.state;

    const { accNumber, clientName, clientEmail, currentBalance } = this.props;

    return (
      <React.Fragment>
        <Paper className="paper pay-in">
          <div>
            <Typography variant="title" component="h1">
              Pay in{" "}
              <span
                className="btn-close"
                onClick={this.props.onClosePayInPanel}
              >
                <Icon>close</Icon>
              </span>
            </Typography>
            <div>
              <div>
                <div>
                  <Typography variant="body2" component="p">
                    Payment account number
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {accNumber ? accNumber : "ERROR"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" component="p">
                    Name
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {clientName ? clientName : "ERROR"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" component="p">
                    Email
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {clientEmail ? clientEmail : "ERROR"}
                  </Typography>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <Typography variant="body2" component="p">
                    Current balance
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {currentBalance ? currentBalance : "ERROR"}
                  </Typography>
                </div>
                <div>
                  <TextField
                    id="payInAmount"
                    label="Amount *"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="payInAmount"
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!accNumber} // nothing passed to the form
                    onClick={this.handlePayIn}
                  >
                    pay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>

        <Message
          variant={messageType}
          message={message}
          open={isMessageOpen}
          onClose={this.handleCloseMessage}
        />
      </React.Fragment>
    );
  }
}