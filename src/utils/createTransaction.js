import { Transaction, SystemProgram, Connection, PublicKey } from '@solana/web3.js';

/**
 * Creates an arbitrary transfer transaction
 * @param   {String}      publicKey  a public key
 * @param   {Connection}  connection an RPC connection
 * @returns {Transaction}            a transaction
 */
const createTransferTransaction = async (publicKey, connection) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: 100,
    })
  );
  transaction.feePayer = publicKey;

  const anyTransaction = transaction;
  anyTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  return transaction;
};

export default createTransferTransaction;