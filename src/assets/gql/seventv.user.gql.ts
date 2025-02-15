import { gql } from "graphql-tag";

export const actorQuery = gql`
	query GetActor {
		user: actor {
			id
			username
			display_name
			avatar_url
			style {
				color
			}
			connections {
				id
				username
				display_name
			}
		}
	}
`;

export const userQuery = gql`
	query GetUser($id: ObjectID!) {
		user: user(id: $id) {
			id
			username
			display_name
			avatar_url
			style {
				color
				paint_id
			}
		}
	}
`;

export namespace userQuery {
	export interface Result {
		user: SevenTV.User;
	}
	export interface Variables {
		id: string;
	}
}

export namespace actorQuery {
	export interface Result {
		user: SevenTV.User;
	}
}
