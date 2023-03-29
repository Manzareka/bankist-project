'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelCredentials = document.querySelector('.credentials');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

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

const displayMovements = function (movements, sort = false) {
  // Clear/empty entire movements container data
  containerMovements.innerHTML = '';

  //create movement sorting logic
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    // defining whether movement type is deposit or withdrawal using ternary operator
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // copy movements row from HTML and replace hardcoded data with actual movements data
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

    // add/attach this new line to the old HTML document movements row
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculate sum of movements arrays, and display them in balance_value
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${outcomes}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}`;
};

// To get user's first letter initials (stw), first we must use toLowerCase and split methods,
// After getting ['steven', 'thomas', 'williams'] array, then we must loop over the array using MAP method, take first letter in each iteration and add them into new array,
// And finally join them.
const user = 'Steven Thomas Williams';
const username = user
  .toLowerCase()
  .split(' ')
  .map(function (name) {
    return name[0];
  })
  .join('');

// creating new property of "username" in all accounts, using forEach function
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);

//Event Handlers

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  // Prevents form from submitting, because as default, the page reloads
  event.preventDefault();

  // to log in we have to find the account from "accounts" array with the username, using the find method and create relevant variable(array)
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.style.color = '#39b385';
    labelWelcome.textContent = `Welcome back!`;
    labelCredentials.textContent = 'Transfer to: jd';

    // display application interface
    containerApp.style.opacity = 100;

    //update UI (display movements, balance and summary)
    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
  } else {
    // wrong username or password
    labelWelcome.textContent = `Wrong username or password!`;
    labelWelcome.style.color = '#ff585f';
    containerApp.style.opacity = 0;
  }

  //clear user and password fields
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();
});

//Implementing transfers:

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);

  // looking for account which has same username value, as the transfer to field
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Displaying transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Updating UI
    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
  }
});

// Transfers

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  // if one element of movements has this condition
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement

    currentAccount.movements.push(amount);

    //update UI (display movements, balance and summary)
    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
  }

  // clear input field
  inputLoanAmount.value = '';
});

//Close Account

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // if credentials for deletion are equal
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // find the index
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // delete account using index and splice method
    accounts.splice(index, 1);

    // hide application interface
    containerApp.style.opacity = 0;

    //Deletion message
    labelWelcome.style.color = '#e52a5a';
    labelWelcome.textContent = `User deleted!`;
  }
});

const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
