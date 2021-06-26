export default class RootNavigation {

    static navigation;
    static route;

    static isAvailable() {
        return this.navigation !== null && this.navigation !== undefined && this.route !== null && this.route !== undefined;
    }

    static setNavigation(navigation) {
        this.navigation = navigation;
    }

    static setRoute(route) {
        this.route = route;
    }

    static navigate(...args) {
        this.navigation.navigate(...args);
    }

    static push(...args) {
        this.navigation.push(...args);
    }

    static goBack() {
        this.navigation.goBack();
    }
}
