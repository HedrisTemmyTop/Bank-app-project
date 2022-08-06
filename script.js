'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  transactionDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-06-01T23:36:17.929Z',
    '2022-06-05T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  transactionDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-06-01T23:36:17.929Z',
    '2022-06-05T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  transactionDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-06-01T23:36:17.929Z',
    '2022-06-05T10:51:36.790Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  transactionDates: [
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-06-01T23:36:17.929Z',
    '2022-06-05T10:51:36.790Z',
  ],
};

const accounts = [account1, account2, account3, account4];

const creatingUsernames = function (userAccounts) {
  userAccounts.forEach(user => {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatingUsernames(accounts);

const userNames = [account1.username, account2.username, account3.username];

///// CALCULATING DATES

const dateFormat = function (transactionDates) {
  ///// CALCULATING DATE DIFFERRECNCE
  const calcDate = function (today, transactionDates) {
    return Math.round(
      Math.abs(today - transactionDates) / (1000 * 60 * 60 * 24)
    );
  };
  const daysPassed = calcDate(new Date(), transactionDates);

  if (daysPassed === 0) return `Today`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${transactionDates.getDate()}`.padStart(2, 0);
    const month = `${transactionDates.getMonth() + 1}`.padStart(2, 0);
    const year = transactionDates.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

//// DISPLAYING THE UI

const displayUI = function (myAccount) {
  // CURRENT DATE WHICH THE USER LOGS IN
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = `${now.getFullYear()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}`;

  // REMOVING THE OPACITY
  containerApp.style.opacity = '1';
  document.querySelector('.message').style.display = 'none';

  //CLEARING THE INITIAL HTML
  containerMovements.innerHTML = '';
  myAccount.transactions.forEach((transaction, transactionIndex) => {
    const transactionDates = new Date(
      myAccount.transactionDates[transactionIndex]
    );

    /// IMPLEMENTING DAYS AGO
    const transactionDate = dateFormat(transactionDates);
    console.log(transactionDate);
    // CHECK THE TRANSACTION TYPE
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';

    // CONSTRUCTING THE ADJACENT HTML
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${transactionType}">${
      transactionIndex + 1
    } ${transactionType}</div>
    <div class="movements__date">${transactionDate}</div>
    <div class="movements__value">${transaction} €</div>
  </div>`;

    // ADDING THE HTML
    containerMovements.insertAdjacentHTML('afterbegin', html);

    /// OUTSIDE MOVEMENTS
    const balance = myAccount.transactions.reduce(
      (bal, transfers) => bal + transfers
    );
    myAccount.balance = balance;
    labelBalance.textContent = `${balance} €`;

    /// INCOMES
    const incomes = myAccount.transactions
      .filter(deposit => deposit > 0)
      .reduce((totalIncome, income) => totalIncome + income, 0);
    labelSumIn.textContent = `${incomes} €`;

    /// SPENDINGS
    const withdraws = myAccount.transactions
      .filter(withdraws => withdraws < 0)
      .reduce((totalWithraw, withdraw) => (totalWithraw += withdraw), 0);
    labelSumOut.textContent = `${Math.abs(withdraws)} €`;

    /// INTEREST
    const interest = myAccount.transactions
      .filter(deposit => deposit > 0)
      .map(deposit => (deposit * 1.2) / 100)
      .filter(deposit => deposit > 1)
      .reduce((totalInterest, interest) => totalInterest + interest, 0);

    labelSumInterest.textContent = `${interest} €`;
  });
};

//// EVENT LISTENERS

// LOGIN FUNCTION
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    current => current.username === inputLoginUsername.value
  );

  if (
    currentAccount &&
    currentAccount.username === inputLoginUsername.value &&
    currentAccount.pin === Number(inputLoginPin.value)
  ) {
    displayUI(currentAccount);
  } else {
    window.alert(
      'Sorry you do not have an account with bankist would you like to create one ?'
    );
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  // const userNameVal = inputLoginUsername.ariaValueMax;
  // const pinVal = inputLoginPin.value
  // if(inputLoginUsername.value === )
});

/// TRANSFER FUNCTION
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const reciever = accounts.find(
    account => account.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    reciever &&
    amount <= currentAccount.balance &&
    reciever !== currentAccount
  ) {
    currentAccount.transactions.push(-amount);
    reciever.transactions.push(amount);
    currentAccount.transactionDates.push(new Date());

    displayUI(currentAccount);
  } else {
    document.write(
      'sorry could not process your transfer try again ensure all conditions are perfect'
    );
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

//REQUESTING LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let loanAmount = Number(inputLoanAmount.value);
  if (loanAmount < currentAccount.balance) {
    currentAccount.transactions.push(loanAmount);
    currentAccount.transactionDates.push(new Date());
    displayUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);
  if (
    confirmPin === currentAccount.pin &&
    confirmUser === currentAccount.username
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(index, 1);
    document.querySelector('.message').style.display = 'block';

    containerApp.style.opacity = '0';
  }
});
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  accounts.forEach(account => account.transactions.sort((a, b) => b - a));
  displayUI(currentAccount);
});
