#include <stdio.h>
#include <stdlib.h>
#include <time.h>

double timeExec(char* program) {
	struct timespec tstart={0,0}, tend={0,0};
	clock_gettime(CLOCK_MONOTONIC, &tstart);
	if (system(program) != 0) {
		fprintf(stderr, "Failed to run: '%s'\n", program);
		exit(1);
		return -1;
	}
	clock_gettime(CLOCK_MONOTONIC, &tend);

	return (
		((double)tend.tv_sec + 1.0e-9*tend.tv_nsec) - 
		((double)tstart.tv_sec + 1.0e-9*tstart.tv_nsec)
	);
}

int main(int argc, char* argv[]) {
	if (argc != 3) {
		fprintf(stderr, "usage: %s <requests> <command>", argv[0]);
		return -1;
	}

	int requests = atoi(argv[1]);
	char* program = argv[2];

	double totalTime = 0.0;
	for (int i = 0; i < requests; i++) {
		totalTime += timeExec(program);
	}
	printf("~%.2fs\n", totalTime / requests);
	return 0;
}
