import {Page, NavController} from 'ionic-angular';
import {GitHubService} from '../../github.service';
import {RepoList} from '../repo-list/repo-list';

@Page({
	templateUrl: './build/pages/search-users/search-users.html'
})
export class SearchUsers {
	input: string;
	users: any[];

	private _nomatch: boolean;
	private _timeout;

	constructor (private _githubService: GitHubService,
		private _nav: NavController) {}

	search (input) {
		if (input.length > 0) this._githubService.searchUsers(input)
			.subscribe(data => {
				this._nomatch = (data.total_count === 0) ? true : false;
				this.users = data.items;
			});
		else this.users = [];
	}

	change (input) {
		this.input = input;
		this._nomatch = false;
		clearTimeout(this._timeout);
		this._timeout = setTimeout(this.search.bind(this, input), 1000);
	}

	select (login) {
		this._nav.push(RepoList, {username: login});
	}

	scroll(infiniteScroll) {
		this._githubService.nextPage()
			.subscribe(data => {
				this.users = this.users.concat(data.items);
				infiniteScroll.complete();
			});
	}
}
