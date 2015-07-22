private var coolDown : float = 3.0;
private var timer : float = 0.0;

function Update () 
{
	timer += Time.deltaTime;
	if(timer >= coolDown)
	{
		Destroy(gameObject);
	}
}

function OnTriggerEnter(col : Collider)
{
	explode();
}

function explode()
{
	var hitColliders = Physics.OverlapSphere(gameObject.transform.position, 1);
	for (var i = 0; i < hitColliders.Length; i++) 
	{
		if(hitColliders[i].gameObject.tag == "Enemy")
		{
			hitColliders[i].gameObject.GetComponent("AI").SendMessage("takeDamage", 100);
		}
	}
	Destroy(gameObject);
}