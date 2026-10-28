export class NotificationCooldown {

    static isActive(cooldownExpiration: number): boolean {
        return Date.now() < cooldownExpiration;
    }

    static start(minutes: number): number {
        return Date.now() + minutes * 60 * 1000;
    }

    static remainingMinutes(cooldownExpiration: number): number {
        const remaining = cooldownExpiration - Date.now();
        return Math.max(
            0,
            Math.ceil(remaining / 60000)
        );
    }
}
