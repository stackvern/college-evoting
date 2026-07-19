const isVoted = (value) => {
    if (value === null || value === undefined || value === '') {
        return false;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        return value === 1;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'y';
    }

    return Boolean(value);
};

module.exports = {
    isVoted
};
