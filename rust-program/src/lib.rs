use borsh::{BorshDeserialize, BorshSerialize};
//use std::collections::HashMap;
//use std::convert::TryInto;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh::try_from_slice_unchecked,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
//Structure of NFT
pub struct IntellectualProperty {
    pub property_owner: String,
    pub hash: String,
    pub value: String,
    pub uri: String,
    pub is_public: String,
    pub for_sale: String,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    //gives all acounts as iterable
    let accounts_iter = &mut accounts.iter();

    //retrives the nft account(Intellectual Property Struct ) supplied through js
    let nft_account = next_account_info(accounts_iter)?;

    //checks if the blockchain is accessed by original program (here owner is Program)
    if nft_account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    //gives the instruction to operate upon
    let (instruction_byte, rest_of_data) = data.split_first().unwrap();

    //create new NFT
    if *instruction_byte == 0 {
        //retrieve the pubkey of owner
        let nft_account_owner = next_account_info(accounts_iter)?;

        // let token = String::from_utf8(rest_of_data[64..].to_vec()).unwrap();

        //creates editable class of Intellectual property
        let mut nft_account_data: IntellectualProperty =
            try_from_slice_unchecked(&nft_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;

        //sets the owner
        nft_account_data.property_owner = nft_account_owner.key.to_string();

        //decode hash from byte array and store it
        let hash = String::from_utf8(rest_of_data[..64].to_vec()).unwrap();
        nft_account_data.hash = hash;

        nft_account_data.value="00000".to_string();
        nft_account_data.uri=String::from_utf8(rest_of_data[64..].to_vec()).unwrap();
        nft_account_data.is_public = "0".to_string();
        nft_account_data.for_sale = "0".to_string();
        nft_account_data
            .serialize(&mut &mut nft_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }
    if *instruction_byte == 1 {
        //makes public
        let mut nft_account_data: IntellectualProperty =
            try_from_slice_unchecked(&nft_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;

        //decode hash from byte array and store it
        let uri = String::from_utf8(rest_of_data[..].to_vec()).unwrap();
        nft_account_data.uri = uri;
        nft_account_data.is_public = "1".to_string();
        
        nft_account_data
            .serialize(&mut &mut nft_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }
    if *instruction_byte == 2 {
        //for sale
        let mut nft_account_data: IntellectualProperty =
            try_from_slice_unchecked(&nft_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;

        //Marking for sale if already made private
        if nft_account_data.is_public == "1"
        {
            nft_account_data.for_sale = "1".to_string();
        }
        else
        {
            return Err(ProgramError::InvalidArgument)
        }
        nft_account_data.value=String::from_utf8(rest_of_data[..].to_vec()).unwrap();
        nft_account_data
            .serialize(&mut &mut nft_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }
    if *instruction_byte == 3 {
        //new Owner
        let mut nft_account_data: IntellectualProperty =
            try_from_slice_unchecked(&nft_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;

        //Assign a new owner when sale is confirmed
        let new_nft_account_owner = next_account_info(accounts_iter)?;

        nft_account_data.property_owner = new_nft_account_owner.key.to_string();
        
        nft_account_data
            .serialize(&mut &mut nft_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }
    Ok(())
}
