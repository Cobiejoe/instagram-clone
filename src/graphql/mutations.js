import { gql } from 'apollo-boost';

export const CREATE_USER = gql`
    mutation createUser($userId: String!, $name: String!, $username: String!, $email: String!, $bio: String!, $website: String!, $profileImage: String!, $phoneNumber: String!) {
        insert_users(objects: {user_id: $userId, name: $name, username: $username, email: $email, bio: $bio, website: $website, phone_number: $phoneNumber, profile_image: $profileImage}) {
            affected_rows
        }
    }
`