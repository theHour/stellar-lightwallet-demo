/**
 * Login page template
 * 
 */
let loginPage = `
    <section class="section" style="padding-top: 0;">
        <div class="container box">
            <h1 class="subtitle">
                Send Lumens Using Stellar Lightweight Client
            </h1>
            <div class="columns">
                <div class="column is-one-third">
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input id="seed" class="input" type="text" placeholder="Example: SCHKBJ............ZLJ7">
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button onclick="login()" class="button is-primary">Sign In</button>
                        </div>
                     </div>
                </div>
            </div>

        </div>
    </section>      
`
/**
 * LoggedInPage
 * 
 * @param {any} key 
 * @param {any} number 
 */
let loggedInPage = (key, number) => `
    <section class="section" style="padding-top: 0;">
        <div class="container box">
            <h2 class="title">
                Your balance
            </h2>
            <h2 id="balance" class="subtitle">
            </h2>
            <h2 class="title">
                Your Stellar Public Key
            </h2>
            <h2 class="subtitle">
                ${key}
            </h2>
            <hr>
            <div>
                <h2 class="subtitle">
                    Send Lumens
                </h2>
                <div class="columns">
                    <div class="column is-one-third">
                        <div class="field">
                            <label class="label">To</label>
                            <div class="control">
                                <input id="seed" class="input" type="text" placeholder="Example: SCHKBJ............ZLJ7">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Amount</label>
                            <div class="control">
                                <input id="seed" class="input" type="text" placeholder="Amount">
                            </div>
                        </div>                        
                        <div class="field">
                            <div class="control">
                                <button class="button is-primary">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
            <hr>
            <h2 class="title">
                Transaction History
            </h2>
            <div id="transactions" class="content">
            </div>
        </div>

    </section>   
`
/**
 * Check the balance of account 
 * We are only checking for lumens currently
 * 
 * @param {any} key 
 */
let getBalance = (key) => {
    server.loadAccount(key).then(acc => {
        acc.balances.forEach( balance => {
            if (balance.asset_type === 'native') {
                document.getElementById('balance').innerHTML = `${balance.balance.substring(0, balance.balance.length - 5)} XLM`
                console.log(`XLM : ${balance.balance}`)
            }
        })
    })
}


/**
 * Renders logged in page
 * 
 * @param {any} secretSeed 
 */
let renderLoggedInPage = (secretSeed) => {
    let publicKey = keypairFromSecret(secretSeed).publicKey()
    let noTx = server.transactions().forAccount(publicKey).call().then(page => {
        document.getElementById('app').innerHTML = loggedInPage(publicKey, page.records.length)
        page.records.forEach(key => {
            document.getElementById('transactions').innerHTML += `<p><a href="http://testnet.stellarchain.io/tx/${key.hash}" target="_blank">${key.hash}</a></p>`
        })
    }).then(log => {
        getBalance(publicKey)
    })
}
/**
 * Login method calls renderLoggedInPage and adds signout button
 * 
 */
let login = () => {
    let secretSeed = document.getElementById('seed').value
    renderLoggedInPage(secretSeed)
    document.getElementById('signout').innerHTML = `<button onclick="logout()" class="button">Sign out</button>`
}

/**
 * Logout method
 * Show initial page
 * 
 */
let logout = () => {
    document.getElementById('app').innerHTML = loginPage
    document.getElementById('signout').innerHTML = ''
}

/**
 * Helper method
 * Generate keypair from secret seed
 * 
 * @param {any} secret 
 * @returns StellarSdk.Keypair
 */
let keypairFromSecret = (secret) => {
    return stellar.Keypair.fromSecret(secret)
}

/** 
 * Basic setup
 * Render login page first and set server url
 * 
*/
document.getElementById('app').innerHTML = loginPage
let stellar = StellarSdk
let server = new stellar.Server('http://13.74.42.19:8000', {allowHttp: true})