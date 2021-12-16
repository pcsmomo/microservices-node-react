## kubectl

kubectl apply -f infra/k8s
kubectl delete -f posts.yaml

<!-- pods -->

kubectl get pods  
kubectl exec -it [pod_name] [cmd]
kubectl logs [pod_name]  
kubectl delete pod [pod_name]  
kubectl apply -f [config_file_name]
kubectl describe pod [pod_name]

<!-- deployment -->

kubectl get deployments
kubectl describe deployment [depl_name]
kubectl apply -f [config_file_name]
kubectl delete deployment [depl_name]
kubectl rollout restart deployment [depl_name]

<!-- service -->

kubectl get services
kubectl describe service [srv_name]
kubectl apply -f [config_file_name]

<!-- ingress-nginx -->

kubectl get ingress
kubectl get pods -n ingress-nginx
kubectl get services -n ingress-nginx

<!-- All? -->

kubectl describe po -A > ~/desc.log

## minikube

minikube start --vm=true
minikube stop
minikube ip
minikube status
minikube dashboard

minikube addons enable ingress
minikube service list
eval $(minikube docker-env)
