export interface Notification {
	id?: number;
	createdAt?: Date | string | any;
	updatedAt?: Date | string | any;
	userEmail: string;
	username: string;
	userImage: string;
	userId: number;
	title: string;
	message: string;
	sender: string;
	seen?: boolean;
	isHovered?: boolean
	externalArgs?: any;
	isSourceWebsocket?: boolean;
	sentSince?: string;
}