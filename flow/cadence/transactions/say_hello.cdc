import HelloWorldTest from "../contracts/HelloWorldTest.cdc"
// import HelloWorldTest from 0xf8d6e0586b0a20c7

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorldTest.hello())
  }
}
