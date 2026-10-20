% main.m - Paper difficulty review (Mamdani fuzzy). Run this file.
clear; clc; close all;
fid = fopen('results.csv','w'); fclose(fid);       % start from an empty results file

[tc,tb,tt] = teacherInput();                       % 1. teacher values (0-100, no rescaling)
[names,c,b,t,~] = studentProcess('students.csv');  % 2. cleaned student data (any class size)

[teacherScore, teacherInfo] = fuzzyDifficulty(tc,tb,tt);   % 3. teacher difficulty

N = numel(names);  ys = zeros(N,1);  infos = cell(N,1);
for i = 1:N                                        % 4. one score per student
    [ys(i), infos{i}] = fuzzyDifficulty(c(i),b(i),t(i));
end

T = table(["Teacher"; repmat("Student",N,1)], ["Pilot"; names(:)], [teacherScore; ys], ...
          'VariableNames',{'Role','Name','Difficulty'});
writetable(T,'results.csv');                       % 5. save results

plotResults(teacherScore, ys, names);              % 6. statistics + two graphs
saveStudentPlots(names, infos, teacherInfo);       % 7. results/ folder, one SVG per student
