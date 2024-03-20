use anchor_lang::prelude::*;
use solana_program::system_instruction;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("5keGyApdrW954HXu2w536iGF6bUDQWBHKXPM3zT7bkka");

#[program]
mod hackheaven1 {
    use super::*;
    // Define the initialize function
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.user_len = 0;
        base_account.post_len = 0;
        Ok(())
    }

    pub fn register_user(
        ctx: Context<AddUser>,
        username: String,
        password: String,
        email: String,
        mob: String,
    ) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let id = base_account.user_len;

        // Check if the user is already registered
        if base_account
            .user_list
            .iter()
            .any(|user| user.email == email)
        {
            return err!(MyError::UserAlreadyRegistered);
        } else {
            let new_user = User {
                id,
                username,
                password,
                email,
                mob,
                own_post: vec![],
            };
            base_account.user_list.push(new_user);
            base_account.user_len += 1;
            Ok(())
        }
    }

    pub fn register_government_user(
        ctx: Context<AddGovernmentUser>,
        username: String,
        department: String,
        email: String,
        mob: String,
        location: String,
        governmentempid: String,
    ) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let id = base_account.government_worker_len;
        let signer = ctx.accounts.signer.key;

        // Check if the user is already registered
        if base_account
            .government_worker_list
            .iter()
            .any(|user| user.email == email)
        {
            return err!(MyError::UserAlreadyRegistered);
        } else {
            let new_user = GovernmentWorker {
                id,
                username,
                department,
                email,
                mob,
                location,
                governmentempid,
                complaint_post: vec![],
                user_address: *signer,
            };
            base_account.government_worker_list.push(new_user);
            base_account.government_worker_len += 1;
            Ok(())
        }
    }

    pub fn create_post(
        ctx: Context<CreatePost>,
        img: Vec<String>,
        title: String,
        description: String,
        location: String,
        priority: String,
        email: String,
    ) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let id = base_account.post_len;

        if let Some(ind) = base_account
            .user_list
            .iter()
            .position(|user| user.email == email)
        {
            let current_timestamp = ctx.accounts.clock.unix_timestamp;
            let user_id = base_account.user_list[ind].id;
            let new_status = Status {
                status: "Under Review".to_string(),
                timestamp: current_timestamp,
            };
            let new_post = Post {
                id,
                user_id,
                img,
                title,
                description,
                location,
                priority,
                email,
                solutionposts: vec![],
                status: vec![new_status],
                feedback: 0,
            };
            base_account.post_list.push(new_post.clone());
            base_account.user_list[ind].own_post.push(id);
            base_account.post_len += 1;
            Ok(())
        } else {
            return err!(MyError::UserNotFound);
        }
    }

    pub fn owner(ctx: Context<Owner>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let signer = ctx.accounts.signer.key;
        base_account.owner = *signer;
        Ok(())
    }

    pub fn add_status(ctx: Context<AddStatus>, id: u64, status: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let signer = ctx.accounts.signer.key;

        if let Some(ind) = base_account
            .post_list
            .iter()
            .position(|post| post.id == id && base_account.owner == *signer)
        {
            let current_timestamp = ctx.accounts.clock.unix_timestamp;
            let new_status = Status {
                status: status.clone(),
                timestamp: current_timestamp,
            };
            base_account.post_list[ind].status.push(new_status);
            Ok(())
        } else {
            return err!(MyError::PostNotFound);
        }
    }

    pub fn add_status_to_government(ctx: Context<AddStatus>, id: u64, workerid: u64) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let signer = ctx.accounts.signer.key;
        let worker_id = workerid as usize;

        if let Some(ind) = base_account
            .post_list
            .iter()
            .position(|post| post.id == id && base_account.owner == *signer)
        {
            let current_timestamp = ctx.accounts.clock.unix_timestamp;
            let new_status = Status {
                status: "Assigned".to_string(),
                timestamp: current_timestamp,
            };
            base_account.post_list[ind].status.push(new_status.clone());

            base_account.government_worker_list[worker_id]
                .complaint_post
                .push(id);
            Ok(())
        } else {
            return err!(MyError::PostNotFound);
        }
    }

    pub fn solution_post(
        ctx: Context<SolutionPostFromWorker>,
        id: u64,
        img: Vec<String>,
        title: String,
        description: String,
    ) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let post_id = id as usize;

        // Create the new solution post
        let new_solutionpost = SolutionPost {
            img,
            title,
            description,
        };

        // Push the new solution post to the post's solutionposts vector
        base_account.post_list[post_id]
            .solutionposts
            .push(new_solutionpost);

        let current_timestamp = ctx.accounts.clock.unix_timestamp;
        let new_status = Status {
            status: "Verify Work".to_string(),
            timestamp: current_timestamp,
        };
        base_account.post_list[post_id]
            .status
            .push(new_status.clone());
        Ok(())
    }

    pub fn post_feedback(ctx: Context<PostFeedback>, id: u64, feedback: u64) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let post_id = id as usize;
        base_account.post_list[post_id].feedback = feedback;
        let current_timestamp = ctx.accounts.clock.unix_timestamp;
        let new_status = Status {
            status: "Complaint Resolved".to_string(),
            timestamp: current_timestamp,
        };
        base_account.post_list[post_id]
            .status
            .push(new_status.clone());
        Ok(())
    }

    pub fn post_feedback_with_money(
        ctx: Context<TransferLamports>,
        id: u64,
        feedback: u64,
        value: u64,
    ) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let post_id = id as usize;

        let from_account = &ctx.accounts.from;
        let to_account = &ctx.accounts.to;
        let to = to_account.key;
        let from = from_account.key;

        // Create the transfer instruction
        let transfer_instruction =
            system_instruction::transfer(from_account.key, to_account.key, value);

        // Invoke the transfer instruction
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                from_account.to_account_info(),
                to_account.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        base_account.post_list[post_id].feedback = feedback;
        let current_timestamp = ctx.accounts.clock.unix_timestamp;
        let new_status = Status {
            status: "Complaint Resolved".to_string(),
            timestamp: current_timestamp,
        };
        base_account.post_list[post_id]
            .status
            .push(new_status.clone());
        Ok(())
    }
}

#[error_code]
pub enum MyError {
    #[msg("User Already Registered")]
    UserAlreadyRegistered,
    #[msg("User not found")]
    UserNotFound,
    #[msg("You're not the owner")]
    YouAreNotTheOwner,
    #[msg("Post not found")]
    PostNotFound,
}

// Define the Initialize accounts struct
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddUser<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct AddGovernmentUser<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    clock: Sysvar<'info, Clock>,
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct Owner<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddStatus<'info> {
    pub clock: Sysvar<'info, Clock>,
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SolutionPostFromWorker<'info> {
    pub clock: Sysvar<'info, Clock>,
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct PostFeedback<'info> {
    pub clock: Sysvar<'info, Clock>,
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct TransferLamports<'info> {
    clock: Sysvar<'info, Clock>,
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct GovernmentWorker {
    pub id: u64,
    pub username: String,
    pub department: String,
    pub email: String,
    pub mob: String,
    pub location: String,
    pub governmentempid: String,
    pub complaint_post: Vec<u64>,
    pub user_address: Pubkey,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct SolutionPost {
    pub img: Vec<String>,
    pub title: String,
    pub description: String,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Status {
    pub status: String,
    pub timestamp: i64,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Post {
    pub id: u64,
    pub user_id: u64,
    pub img: Vec<String>,
    pub title: String,
    pub description: String,
    pub location: String,
    pub priority: String,
    pub email: String,
    pub solutionposts: Vec<SolutionPost>,
    pub status: Vec<Status>,
    pub feedback: u64,
}

// Define the User struct
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct User {
    pub id: u64,
    pub username: String,
    pub password: String,
    pub email: String,
    pub mob: String,
    pub own_post: Vec<u64>,
}

#[account]
pub struct BaseAccount {
    pub user_len: u64,
    pub user_list: Vec<User>,
    pub post_len: u64,
    pub post_list: Vec<Post>,
    pub owner: Pubkey,
    pub government_worker_len: u64,
    pub government_worker_list: Vec<GovernmentWorker>,
}